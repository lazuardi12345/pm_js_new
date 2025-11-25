import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as Minio from 'minio';
import { EncKey } from './helper/Func_EncKey.help';
import {
  IFileStorageRepository,
  FileMetadata,
} from '../../Domain/Repositories/IFileStorage.repository';
// import { SingleUploadFileType } from 'src/Shared/Interface/Storage_SingleUploadType/SingleUploadFile.interface';
import { REQUEST_TYPE } from './Interface/RequestType.interface';
import { generateRandomFolder } from './helper/Func_GenerateRandom.help';
import { checkPathExists } from './helper/Func_isPathExist.help';
import { buildFileUrl } from './helper/Func_URLBuilder.help';
import { parseUrlPath } from './helper/Func_ParseURL.help';

type MinioObject = {
  name: string;
  size?: number;
  etag?: string;
  lastModified?: Date;
};

@Injectable()
export class MinioFileStorageService implements IFileStorageRepository {
  private readonly logger = new Logger(MinioFileStorageService.name);
  private minioClient: Minio.Client;
  private readonly encKey: EncKey;
  private readonly customer_internal = 'customer-internal';
  private readonly customer_external = 'customer-external';
  private readonly approvalRecommendationBucket =
    'approval-recommendation-files';
  private readonly randomFolderGenerator = generateRandomFolder;
  private readonly isPathExist = checkPathExists;
  private readonly buildFileUrl = buildFileUrl;

  constructor() {
    // Initialize MinIO Client
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: process.env.MINIO_PORT
        ? parseInt(process.env.MINIO_PORT, 10)
        : 9002,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
      secretKey: process.env.MINIO_SECRET_KEY || 'admin123',
    });

    this.encKey = new EncKey(); // <-- Tambahkan baris ini

    // Ensure buckets exist
    this.ensureBucket(this.customer_internal);
    this.ensureBucket(this.customer_external);
    this.ensureBucket(this.approvalRecommendationBucket);
  }

  private async ensureBucket(bucketName: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        this.logger.log(`Bucket '${bucketName}' created`);
      }
    } catch (error) {
      this.logger.error(`Error ensuring bucket: ${error.message}`);
    }
  }

  private getBucketType(type: REQUEST_TYPE): string {
    switch (type) {
      case 'customer-internal':
        return REQUEST_TYPE.INTERNAL;
      case 'customer-external':
        return REQUEST_TYPE.EXTERNAL;
      default:
        throw new HttpException('REQUEST IS NOT VALID', HttpStatus.BAD_REQUEST);
    }
  }

  private getCustomerPrefix(customerNIN: string, customerName: string): string {
    return `${customerNIN}-${customerName}/`;
  }

  // ============== CREATE/UPLOAD ==============

  //? ADMIN BI =====================================!

  async saveApprovalRecommedationFiles(
    customerId: string,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, FileMetadata[]>> {
    const bucket = this.approvalRecommendationBucket;
    const prefix = this.getCustomerPrefix(customerId, customerName);
    const savedFiles: Record<string, FileMetadata[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList || fileList.length === 0) continue;

      savedFiles[field] = [];

      for (const file of fileList) {
        const ext = file.originalname.split('.').pop();
        const newFileName = `${customerName}-${field}.${ext}`;
        const metadata = await this.uploadApprovalRecommendationFile(
          bucket,
          prefix,
          file,
          newFileName,
        );
        savedFiles[field].push(metadata);
      }
    }

    return savedFiles;
  }

  private async uploadApprovalRecommendationFile(
    bucket: string,
    prefix: string,
    file: Express.Multer.File,
    customFileName?: string,
  ): Promise<FileMetadata> {
    try {
      // Encrypt file
      const { encrypted, iv } = this.encKey.encrypt(file.buffer);

      // Tentukan nama file yang akan di-upload
      const filenameToUse = customFileName || file.originalname;
      const encryptedName = `${prefix}${filenameToUse}.enc`;

      // Upload ke MinIO
      await this.minioClient.putObject(
        bucket,
        encryptedName,
        encrypted,
        encrypted.length,
        {
          'Content-Type': 'application/octet-stream',
          'X-Original-Mimetype': file.mimetype,
          'X-Encryption-IV': iv,
          'X-Original-Filename': file.originalname,
          'X-Original-Size': file.size.toString(),
        },
      );

      const prefixParser = (prefix: string) => {
        const trimmed = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
        const [id, ...rest] = trimmed.split('-');
        const name = rest.join('-');
        return [id, name];
      };

      const [id, name] = prefixParser(prefix);

      this.logger.log(`File uploaded: ${encryptedName}`);
      console.log({
        buffer: file.buffer,
        destination: file.destination,
        fieldname: file.fieldname,
        filename: file.filename,
        path: file.path,
        stream: file.stream,
        originalName: file.originalname,
        prefix: prefix,
        usedFilename: filenameToUse,
      });

      return {
        originalName: file.originalname,
        mimetype: file.mimetype,
        encryptedName: encryptedName,
        size: file.size,
        url: `${process.env.BACKEND_URI}/storage/bi-check/${id}/${name}/${filenameToUse}`,
      };
    } catch (error: any) {
      console.log('Error uploading file', error);
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  async getFilesForApprovalRecommendations(
    customerNIN: string,
    customerName: string,
    filename: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }> {
    try {
      const bucket = this.approvalRecommendationBucket;
      const prefix = this.getCustomerPrefix(customerNIN, customerName);
      const encryptedName = filename.endsWith('.enc')
        ? `${prefix}${filename}`
        : `${prefix}${filename}.enc`;

      console.log('kamilah duo trio: ', { bucket, prefix, encryptedName });

      // Get metadata
      const stat = await this.minioClient.statObject(bucket, encryptedName);
      const iv = stat.metaData['x-encryption-iv'];
      const mimetype =
        stat.metaData['x-original-mimetype'] || 'application/octet-stream';
      const originalName = stat.metaData['x-original-filename'] || filename;

      if (!iv) {
        throw new Error('Encryption IV not found in metadata');
      }

      // Download encrypted file
      const dataStream = await this.minioClient.getObject(
        bucket,
        encryptedName,
      );
      const chunks: Buffer[] = [];

      for await (const chunk of dataStream) {
        chunks.push(chunk);
      }

      const encryptedBuffer = Buffer.concat(chunks);

      // Decrypt
      const decryptedBuffer = this.encKey.decrypt(encryptedBuffer, iv);

      return {
        buffer: decryptedBuffer,
        mimetype,
        originalName,
      };
    } catch (error) {
      this.logger.error(`Error getting file: ${error.message}`);
      if (error.code === 'NoSuchKey') {
        throw new NotFoundException(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  //? ==============================================!

  //? MKT,SPV,CA,HM ================================!

  // ============== SAVE FILES ==============
  async saveFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    type: REQUEST_TYPE,
  ): Promise<Record<string, FileMetadata[]>> {
    const bucket = this.getBucketType(type);

    const cleanName = customerName.toLowerCase().replace(/\s+/g, '_');
    const plainPrefix = `${customerId}-${cleanName}`;

    const encryptedCustomerId = this.encKey.encryptString(
      customerId.toString(),
    );
    const encryptedCustomerName = this.encKey.encryptString(customerName);

    const safeCustomerId = encryptedCustomerId.encrypted.toString('base64url');
    const safeCustomerName =
      encryptedCustomerName.encrypted.toString('base64url');

    // ✅ Validate: Harusnya ga ada dot
    console.log('Encoded ID:', safeCustomerId);
    console.log('Has dot?', safeCustomerId.includes('.')); // Should be false!

    if (safeCustomerId.includes('.') || safeCustomerName.includes('.')) {
      console.error('⚠️ WARNING: base64url contains invalid dot character!');
    }

    // Format: {length}.{encId}{encName}
    // Example: "22.oABhm_XJLgpBlOjeuA-dYw_fwbK9OFA3vu4zLAsYju"
    const encryptedPrefix = `${safeCustomerId.length}.${safeCustomerId}${safeCustomerName}`;

    this.logger.log('Generated encrypted prefix:', {
      customerId,
      customerName,
      encryptedPrefix: encryptedPrefix.substring(0, 50) + '...',
      idLength: safeCustomerId.length,
    });

    const savedFiles: Record<string, FileMetadata[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList || fileList.length === 0) continue;

      savedFiles[field] = [];

      for (const file of fileList) {
        const ext = file.originalname.split('.').pop();
        const newFileName = `${cleanName}-${field}.${ext}`;

        const metadata = await this.uploadSingleFile(
          bucket,
          plainPrefix,
          file,
          newFileName,
          false,
        );

        metadata.url = `${process.env.BACKEND_URI}/storage/${bucket}/${encryptedPrefix}/${newFileName}`;
        metadata.encryptedPath = encryptedPrefix;

        savedFiles[field].push(metadata);
      }
    }

    return savedFiles;
  }

  async saveRepeatOrderFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    type: REQUEST_TYPE,
  ): Promise<Record<string, FileMetadata[]>> {
    const bucket = this.getBucketType(type);

    const cleanName = customerName.toLowerCase().replace(/\s+/g, '_');
    const plainPrefix = `${customerId}-${cleanName}`;

    const encryptedCustomerId = this.encKey.encryptString(
      customerId.toString(),
    );
    const encryptedCustomerName = this.encKey.encryptString(customerName);
    const safeCustomerId = encryptedCustomerId.encrypted.toString('base64url');
    const safeCustomerName =
      encryptedCustomerName.encrypted.toString('base64url');
    // Di saveRepeatOrderFiles()
    const encryptedPrefix = `${safeCustomerId.length}.${safeCustomerId}${safeCustomerName}`;
    let repeatOrderFolder = generateRandomFolder();
    let fullPlainPrefix = `${plainPrefix}/${repeatOrderFolder}`;

    let exists = await checkPathExists(
      this.minioClient,
      bucket,
      fullPlainPrefix,
    );

    while (exists) {
      repeatOrderFolder = generateRandomFolder();
      fullPlainPrefix = `${plainPrefix}/${repeatOrderFolder}`;
      exists = await checkPathExists(this.minioClient, bucket, fullPlainPrefix);
    }

    const savedFiles: Record<string, FileMetadata[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList || fileList.length === 0) continue;

      savedFiles[field] = [];

      for (const file of fileList) {
        const ext = file.originalname.split('.').pop();
        const newFileName = `${cleanName}-${field}.${ext}`;
        const metadata = await this.uploadSingleFile(
          bucket,
          fullPlainPrefix,
          file,
          newFileName,
          true,
        );

        metadata.url = `${process.env.BACKEND_URI}/storage/${bucket}/${encryptedPrefix}/${repeatOrderFolder}/${newFileName}`;
        metadata.encryptedPath = encryptedPrefix;
        metadata.repeatOrderFolder = repeatOrderFolder;
        savedFiles[field].push(metadata);
      }
    }

    this.logger.log('Repeat order files saved:', {
      customerId,
      customerName,
      encryptedPrefix,
      repeatOrderFolder,
      fileCount: Object.keys(savedFiles).length,
    });

    return savedFiles;
  }

  private async uploadSingleFile(
    bucket: string,
    prefix: string, // Plain prefix (3201-john_doe)
    file: Express.Multer.File,
    customFileName?: string,
    isRepeatOrder: boolean = false,
  ): Promise<FileMetadata> {
    try {
      const { encrypted, iv } = this.encKey.encrypt(file.buffer);

      const filenameToUse = customFileName || file.originalname;
      const cleanPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
      const encryptedName = `${cleanPrefix}${filenameToUse}.enc`;

      const metadata: Record<string, string> = {
        'Content-Type': 'application/octet-stream',
        'X-Original-Mimetype': file.mimetype,
        'X-Encryption-IV': iv,
        'X-Original-Filename': file.originalname,
        'X-Original-Size': file.size.toString(),
      };

      await this.minioClient.putObject(
        bucket,
        encryptedName,
        encrypted,
        encrypted.length,
        metadata,
      );

      this.logger.log(`File uploaded: ${encryptedName}`);

      return {
        originalName: file.originalname,
        mimetype: file.mimetype,
        encryptedName: encryptedName,
        size: file.size,
        url: '',
      };
    } catch (error: any) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  //? ==============================================!

  // ============== READ/GET ==============

  async getFile(
    encryptedPrefix: string,
    filename: string,
    type: REQUEST_TYPE,
    roFolder?: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }> {
    try {
      const bucket = this.getBucketType(type);

      // ✅ Parse length prefix
      const dotIndex = encryptedPrefix.indexOf('.');

      if (dotIndex === -1) {
        throw new BadRequestException('Invalid encrypted prefix format');
      }

      const idLength = parseInt(encryptedPrefix.substring(0, dotIndex), 10);

      if (isNaN(idLength)) {
        throw new BadRequestException('Invalid length in encrypted prefix');
      }
      const combined = encryptedPrefix.substring(dotIndex + 1);
      const encId = combined.substring(0, idLength);
      const encName = combined.substring(idLength);

      this.logger.log('Parsing encrypted prefix:', {
        idLength,
        encIdLength: encId.length,
        encNameLength: encName.length,
      });
      let plainCustomerId: string;
      let plainCustomerName: string;

      try {
        plainCustomerId = this.encKey.decryptString({
          encrypted: Buffer.from(encId, 'base64url'),
        });

        plainCustomerName = this.encKey.decryptString({
          encrypted: Buffer.from(encName, 'base64url'),
        });

        this.logger.log('Decrypted successfully:', {
          plainCustomerId,
          plainCustomerName,
        });
      } catch (decryptError: any) {
        this.logger.error('Decryption failed:', decryptError.message);
        throw new BadRequestException('Invalid encrypted prefix');
      }

      // Build plain path
      const cleanName = plainCustomerName.toLowerCase().replace(/\s+/g, '_');
      const plainPrefix = `${plainCustomerId}-${cleanName}`;

      let fullPath: string;
      if (roFolder) {
        fullPath = `${plainPrefix}/${roFolder}/${filename}`;
      } else {
        fullPath = `${plainPrefix}/${filename}`;
      }

      const encryptedName = fullPath.endsWith('.enc')
        ? fullPath
        : `${fullPath}.enc`;

      this.logger.log('Fetching file:', { bucket, encryptedName });

      // Get file
      const dataStream = await this.minioClient.getObject(
        bucket,
        encryptedName,
      );
      const chunks: Buffer[] = [];

      for await (const chunk of dataStream) {
        chunks.push(chunk);
      }

      const encryptedBuffer = Buffer.concat(chunks);

      // Get metadata
      const stat = await this.minioClient.statObject(bucket, encryptedName);
      const mimetype = stat.metaData['x-original-mimetype'];
      const originalName = stat.metaData['x-original-filename'];
      const storedIv = stat.metaData['x-encryption-iv'];

      this.logger.log('File metadata retrieved');

      // Decrypt file content
      let decryptedBuffer: Buffer;

      try {
        if (storedIv) {
          this.logger.log('Using stored IV (legacy)');
          decryptedBuffer = this.encKey.decrypt(encryptedBuffer, storedIv);
        } else {
          this.logger.log('Using fixed IV');
          decryptedBuffer = this.encKey.decrypt(encryptedBuffer);
        }
      } catch (decryptError: any) {
        this.logger.error('File decryption failed:', decryptError.message);
        throw new Error('Failed to decrypt file content');
      }

      return {
        buffer: decryptedBuffer,
        mimetype,
        originalName,
      };
    } catch (error: any) {
      this.logger.error(`Error getting file: ${error.message}`);

      if (error.code === 'NoSuchKey') {
        throw new NotFoundException(`File not found: ${filename}`);
      }

      throw error;
    }
  }

  // Helper method untuk list semua RO folders dari customer tertentu
  async listRepeatOrderFolders(
    encryptedCustomerId: string,
    encryptedCustomerName: string,
    type: REQUEST_TYPE,
  ): Promise<string[]> {
    try {
      const bucket = this.getBucketType(type);
      const prefix = `${encryptedCustomerId}/${encryptedCustomerName}/`;

      const stream = this.minioClient.listObjectsV2(bucket, prefix, false);
      const roFolders = new Set<string>();

      for await (const obj of stream) {
        // Parse path: {encId}/{encName}/ro-XXXXX/filename.enc
        const pathParts = obj.name.split('/');
        if (pathParts.length >= 4 && pathParts[2].startsWith('ro-')) {
          roFolders.add(pathParts[2]); // ro-GH871S, ro-KLL891, etc
        }
      }

      return Array.from(roFolders).sort();
    } catch (error: any) {
      this.logger.error(`Error listing RO folders: ${error.message}`);
      return [];
    }
  }

  async listCustomerFiles(
    encryptedCustomerId: string,
    encryptedCustomerName: string,
    type: REQUEST_TYPE,
    roFolder?: string,
  ): Promise<
    Array<{ filename: string; path: string; isRepeatOrder: boolean }>
  > {
    try {
      const bucket = this.getBucketType(type);
      let prefix: string;

      if (roFolder) {
        prefix = `${encryptedCustomerId}/${encryptedCustomerName}/${roFolder}/`;
      } else {
        prefix = `${encryptedCustomerId}/${encryptedCustomerName}/`;
      }

      const stream = this.minioClient.listObjectsV2(bucket, prefix, true);
      const files: Array<{
        filename: string;
        path: string;
        isRepeatOrder: boolean;
      }> = [];

      for await (const obj of stream) {
        const pathParts = obj.name.split('/');
        const filename = pathParts[pathParts.length - 1].replace('.enc', '');
        const isRO = pathParts.length >= 4 && pathParts[2].startsWith('ro-');

        files.push({
          filename,
          path: obj.name,
          isRepeatOrder: isRO,
        });
      }

      return files;
    } catch (error: any) {
      this.logger.error(`Error listing files: ${error.message}`);
      return [];
    }
  }

  async updateFile(
    customerId_OR_URL: string,
    customerName: string,
    fieldType: string, // ← Ini field type (foto_ktp, foto_kk, dll)
    file: Express.Multer.File,
    type: REQUEST_TYPE,
  ): Promise<FileMetadata> {
    try {
      const bucket = this.getBucketType(type);

      console.log('** Update File Input:', {
        customerId_OR_URL,
        customerName,
        fieldType,
        uploadedFile: file.originalname,
      });

      let pathInfo: {
        customerId: string;
        customerName: string;
        isRepeatOrder: boolean;
        roFolder?: string;
        fieldType?: string; // ← Extract field dari URL
        originalFilename?: string;
      };

      if (
        customerId_OR_URL.includes('http://') ||
        customerId_OR_URL.includes('https://')
      ) {
        pathInfo = parseUrlPath(customerId_OR_URL, this.encKey);
        console.log('** Parsed from URL:', pathInfo);

        const urlFilename = pathInfo.originalFilename || '';
        const match = urlFilename.match(/-(foto_\w+|bukti_\w+)\./);
        if (match) {
          fieldType = match[1]; // foto_ktp, foto_kk, bukti_absensi, dll
          console.log('** Extracted field type from URL:', fieldType);
        }
      } else {
        pathInfo = {
          customerId: customerId_OR_URL,
          customerName: customerName,
          isRepeatOrder: false,
        };
        console.log('** Using plain ID:', pathInfo);
      }

      const cleanName = pathInfo.customerName
        .toLowerCase()
        .replace(/\s+/g, '_');

      const ext = file.originalname.split('.').pop();
      const targetFilename = `${cleanName}-${fieldType}.${ext}`;

      let plainPrefix: string;
      if (pathInfo.isRepeatOrder && pathInfo.roFolder) {
        plainPrefix = `${pathInfo.customerId}-${cleanName}/${pathInfo.roFolder}`;
        console.log('==== RO Path:', plainPrefix);
      } else {
        plainPrefix = `${pathInfo.customerId}-${cleanName}`;
        console.log('==== Root Path:', plainPrefix);
      }

      const fullPath = `${plainPrefix}/${targetFilename}`;
      const encryptedName = fullPath.endsWith('.enc')
        ? fullPath
        : `${fullPath}.enc`;

      console.log('==== Target file:', encryptedName);

      // Check if file exists
      try {
        await this.minioClient.statObject(bucket, encryptedName);
        console.log('** File exists, proceeding with update');
      } catch (error: any) {
        if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
          console.error('# File not found:', encryptedName);
          throw new NotFoundException(`File not found: ${encryptedName}`);
        }
        throw error;
      }

      // Encrypt new file
      const { encrypted, iv } = this.encKey.encrypt(file.buffer);

      // Replace file
      await this.minioClient.putObject(
        bucket,
        encryptedName,
        encrypted,
        encrypted.length,
        {
          'Content-Type': 'application/octet-stream',
          'X-Original-Mimetype': file.mimetype,
          'X-Encryption-IV': iv,
          'X-Original-Filename': file.originalname,
          'X-Original-Size': file.size.toString(),
        },
      );

      console.log('✅ File updated successfully:', encryptedName);

      // Build encrypted prefix untuk new URL
      const encryptedCustomerId = this.encKey.encryptString(
        pathInfo.customerId,
      );
      const encryptedCustomerName = this.encKey.encryptString(
        pathInfo.customerName,
      );
      const safeCustomerId =
        encryptedCustomerId.encrypted.toString('base64url');
      const safeCustomerName =
        encryptedCustomerName.encrypted.toString('base64url');
      const encryptedPrefix = `${safeCustomerId.length}.${safeCustomerId}${safeCustomerName}`;

      // Build URL
      const url =
        pathInfo.isRepeatOrder && pathInfo.roFolder
          ? `${process.env.BACKEND_URI}/storage/${bucket}/${encryptedPrefix}/${pathInfo.roFolder}/${targetFilename}`
          : `${process.env.BACKEND_URI}/storage/${bucket}/${encryptedPrefix}/${targetFilename}`;

      console.log('🔗 New URL:', url);

      return {
        originalName: file.originalname,
        encryptedName,
        mimetype: file.mimetype,
        size: file.size,
        url,
      };
    } catch (error: any) {
      console.error('❌ Update file error:', error);
      this.logger.error(`Error updating file: ${error.message}`);
      throw error;
    }
  }

  async updateFileDirectory(
    customerId: string,
    oldCustomerName: string,
    newCustomerName: string,
  ) {
    const bucket = 'customer-files';
    const oldPrefix = `${customerId}-${oldCustomerName}/`;
    const newPrefix = `${customerId}-${newCustomerName}/`;

    const objects: MinioObject[] = [];
    const stream = this.minioClient.listObjectsV2(bucket, oldPrefix, true);

    for await (const obj of stream) {
      objects.push(obj);
    }

    if (objects.length === 0) {
      throw new Error(`No files found in ${oldPrefix}`);
    }

    for (const obj of objects) {
      const newKey = obj.name.replace(oldPrefix, newPrefix);
      await this.minioClient.copyObject(
        bucket,
        newKey,
        `/${bucket}/${obj.name}`,
      );
    }

    for (const obj of objects) {
      await this.minioClient.removeObject(bucket, obj.name);
    }

    return {
      oldPrefix,
      newPrefix,
      totalMoved: objects.length,
      message: 'All files moved successfully',
    };
  }

  // ============== LIST ==============

  async listFiles(
    customerId: string,
    customerName: string,
    type: REQUEST_TYPE,
  ): Promise<FileMetadata[]> {
    try {
      const bucket = this.getBucketType(type);
      const prefix = this.getCustomerPrefix(customerId, customerName);
      const files: FileMetadata[] = [];

      const stream = this.minioClient.listObjects(bucket, prefix, true);

      for await (const obj of stream) {
        if (obj.name.endsWith('.enc')) {
          try {
            const stat = await this.minioClient.statObject(bucket, obj.name);
            files.push({
              originalName: stat.metaData['x-original-filename'] || obj.name,
              encryptedName: obj.name,
              mimetype:
                stat.metaData['x-original-mimetype'] ||
                'application/octet-stream',
              size: parseInt(stat.metaData['x-original-size']) || obj.size,
              url: `${bucket}/${obj.name}`,
            });
          } catch (err) {
            this.logger.warn(`Could not get metadata for ${obj.name}`);
          }
        }
      }

      return files;
    } catch (error) {
      this.logger.error(`Error listing files: ${error.message}`);
      throw error;
    }
  }

  // ============== DELETE ==============

  async deleteFile(
    customerId: string,
    customerName: string,
    filename: string,
    type: REQUEST_TYPE,
    isRepeatOrder?: boolean,
    repeatOrderPath?: string,
  ): Promise<void> {
    try {
      const bucket = this.getBucketType(type);
      const prefix = this.getCustomerPrefix(customerId, customerName);
      const encryptedName = filename.endsWith('.enc')
        ? `${prefix}${filename}`
        : `${prefix}${filename}.enc`;

      // Check if file exists
      try {
        await this.minioClient.statObject(bucket, encryptedName);
      } catch (error) {
        throw new NotFoundException(`File not found: ${filename}`);
      }

      // Delete file
      await this.minioClient.removeObject(bucket, encryptedName);
      this.logger.log(`File deleted: ${encryptedName}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  async deleteCustomerFiles(
    customerId: string,
    customerName: string,
    type: REQUEST_TYPE,
  ): Promise<void> {
    try {
      const bucket = this.getBucketType(type);
      const prefix = this.getCustomerPrefix(customerId, customerName);

      const objectsList: string[] = [];
      const stream = this.minioClient.listObjects(bucket, prefix, true);

      for await (const obj of stream) {
        objectsList.push(obj.name);
      }

      if (objectsList.length > 0) {
        await this.minioClient.removeObjects(bucket, objectsList);
        this.logger.log(
          `Deleted ${objectsList.length} files for customer ${customerId}`,
        );
      }
    } catch (error) {
      this.logger.error(`Error deleting customer files: ${error.message}`);
      throw error;
    }
  }
}
