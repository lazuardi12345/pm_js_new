import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import {
  IFileStorageRepository,
  FileMetadata,
} from '../../Domain/Repositories/IFileStorage.repository';

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

  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly mainBucket = 'customer-files';
  private readonly draftBucket = 'customer-drafts';
  private readonly approvalRecommendationBucket =
    'approval-recommendation-files';

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

    // Encryption key (32 bytes)
    this.key = Buffer.from(
      process.env.CRYPT_KEY || 'your-super-secret-32-char-key!',
    ).slice(0, 32);

    // Ensure buckets exist
    this.ensureBucket(this.mainBucket);
    this.ensureBucket(this.draftBucket);
    this.ensureBucket(this.approvalRecommendationBucket);
  }

  // ============== ENCRYPT ION HELPERS ==============
  private encrypt(buffer: Buffer): { encrypted: Buffer; iv: string } {
    // Ambil IV dari env atau generate random
    const ivString = process.env.CRYPT_IV;
    const iv = Buffer.from(ivString!, 'utf-8');
    // Pastikan panjang key valid
    if (this.key.length !== 32) {
      throw new Error(
        `Invalid key length: ${this.key.length}. Must be 32 bytes for AES-256-CBC.`,
      );
    }
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return { encrypted, iv: iv.toString('utf-8') };
  }

  private decrypt(encryptedBuffer: Buffer, ivHex: string): Buffer {
    const iv = Buffer.from(ivHex, 'utf-8');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  }

  // ============== BUCKET HELPERS ==============

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

  private getBucketName(isDraft: boolean): string {
    return isDraft ? this.draftBucket : this.mainBucket;
  }

  private getCustomerPrefix(customerId: number, customerName: string): string {
    return `${customerId}-${customerName}/`;
  }

  private async findFolderByLoanId(
    bucket: string,
    customerPrefix: string,
    loanId: number,
  ): Promise<{ pengajuanIndex: number; folderPath: string } | null> {
    try {
      // Scan all files under customer prefix
      const stream = this.minioClient.listObjectsV2(
        bucket,
        customerPrefix,
        true, // recursive
      );

      for await (const obj of stream) {
        try {
          // Get metadata
          const stat = await this.minioClient.statObject(bucket, obj.name);
          const metadata = stat.metaData;

          // Check if loan-id matches
          const fileLoanId = metadata['x-loan-id'] || metadata['X-Loan-Id'];

          if (fileLoanId === loanId.toString()) {
            // Extract index from path
            // Path example: "NIK-NAMA/repeat-order-2/file.enc"
            const match = obj.name.match(/repeat-order-(\d+)\//);

            if (match) {
              const pengajuanIndex = parseInt(match[1]);
              const folderPath = obj.name.substring(
                0,
                obj.name.indexOf('/', customerPrefix.length) + 1,
              );

              this.logger.log(
                `Found existing repeat-order folder: ${folderPath} with loan_id: ${loanId}`,
              );

              return {
                pengajuanIndex,
                folderPath,
              };
            }
          }
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }

      return null;
    } catch (error) {
      this.logger.error(`Error finding folder by loan ID: ${error.message}`);
      return null;
    }
  }

  private async hasValidRootFiles(
    bucket: string,
    customerPrefix: string,
  ): Promise<boolean> {
    try {
      const requiredFiles = [
        'foto_ktp',
        'foto_kk',
        'foto_rekening',
        'bukti_absensi',
      ];

      let foundFilesCount = 0;

      // List files di root folder (non-recursive)
      const stream = this.minioClient.listObjectsV2(
        bucket,
        customerPrefix,
        false, // Non-recursive: cuma di root folder
      );

      for await (const obj of stream) {
        // Skip kalau file ada di subfolder
        if (obj.name.includes('repeat-order')) {
          continue;
        }

        // Cek apakah file termasuk required files
        const fileName = obj.name
          .replace(customerPrefix, '')
          .replace('.enc', '');

        for (const requiredField of requiredFiles) {
          if (fileName.includes(requiredField)) {
            foundFilesCount++;
            this.logger.log(`Found required file in root: ${fileName}`);
            break;
          }
        }

        // Kalau udah ketemu 4, langsung return true
        if (foundFilesCount >= 4) {
          this.logger.log(`Valid root files found: ${foundFilesCount}/4`);
          return true;
        }
      }

      this.logger.log(`Insufficient root files: ${foundFilesCount}/4`);
      return false;
    } catch (error) {
      this.logger.error(`Error checking root files: ${error.message}`);
      return false;
    }
  }

  async getNextPengajuanIndex(
    customerId: number,
    customerName: string,
    isDraft: boolean = false,
  ): Promise<number> {
    try {
      const bucket = this.getBucketName(isDraft);
      const customerPrefix = this.getCustomerPrefix(customerId, customerName);

      // List semua objects di customer folder (recursive untuk dapat subfolder)
      const stream = this.minioClient.listObjectsV2(
        bucket,
        customerPrefix,
        true, // ← RECURSIVE biar dapat semua subfolder
      );

      let maxIndex = 0;

      for await (const obj of stream) {
        // Match pattern: repeat-order-1/, repeat-order-2/, etc
        const match = obj.name.match(/repeat-order-(\d+)\//);
        if (match) {
          const index = parseInt(match[1]);
          if (index > maxIndex) {
            maxIndex = index;
          }
        }
      }

      const nextIndex = maxIndex + 1;
      this.logger.log(
        `Next repeat-order index: ${nextIndex} (found max: ${maxIndex})`,
      );

      return nextIndex;
    } catch (error) {
      this.logger.error(`Error getting next pengajuan index: ${error.message}`);
      return 1; // Default kalau error
    }
  }

  // ============== CREATE/UPLOAD ==============

  async saveFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    isDraft: boolean = false,
  ): Promise<Record<string, FileMetadata[]>> {
    const bucket = this.getBucketName(isDraft);
    const prefix = this.getCustomerPrefix(customerId, customerName);
    const savedFiles: Record<string, FileMetadata[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList || fileList.length === 0) continue;

      savedFiles[field] = [];

      for (const file of fileList) {
        const ext = file.originalname.split('.').pop();
        const cleanName = customerName.toLowerCase().replace(/\s+/g, '_');
        const newFileName = `${cleanName}-${field}.${ext}`;

        const metadata = await this.uploadSingleFile(
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

  async saveDraftsFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    isDraft: boolean = false,
  ): Promise<Record<string, FileMetadata[]>> {
    const bucket = this.getBucketName(isDraft);
    const prefix = this.getCustomerPrefix(customerId, customerName);
    const savedFiles: Record<string, FileMetadata[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList || fileList.length === 0) continue;

      savedFiles[field] = [];

      for (const file of fileList) {
        // Ambil ekstensi file
        const ext = file.originalname.split('.').pop();
        // Buat nama file baru: <nama_nasabah>-<tipe_field>.<ext>
        const newFileName = `${customerName}-${field}.${ext}`;

        // Upload pake nama baru
        const metadata = await this.uploadSingleFile(
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

  async saveRepeatOrderFiles(
    customerId: number,
    customerName: string,
    nextPengajuanIndex: number,
    files: Record<string, Express.Multer.File[] | undefined>,
    repeatFromLoanId?: number,
    loanMetadata?: {
      loanId: number;
      nasabahId: number;
      nominalPinjaman: number;
      tenor: number;
    },
  ): Promise<{
    savedFiles: Record<string, FileMetadata[]>;
    isUpdate: boolean;
    pengajuanFolder: string;
    originalLoanId?: number;
  }> {
    try {
      const bucket = this.mainBucket;
      const customerPrefix = this.getCustomerPrefix(customerId, customerName);

      let targetPengajuanIndex = nextPengajuanIndex;
      let isUpdate = false;
      let originalLoanId: number | undefined;

      // ============== CEK APAKAH ADA 4 FILE WAJIB DI ROOT ==============
      const hasValidFiles = await this.hasValidRootFiles(
        bucket,
        customerPrefix,
      );

      this.logger.log('Root files validation:', {
        customerPrefix,
        hasValidFiles,
        nextPengajuanIndex,
      });

      // ============== TENTUKAN FOLDER STRUCTURE ==============
      let pengajuanFolder: string;

      if (!hasValidFiles) {
        // TIDAK ADA 4 file wajib di root → taruh di ROOT
        pengajuanFolder = customerPrefix;
        this.logger.log('NO valid root files: using ROOT folder');
      } else {
        // ADA 4 file wajib di root → bikin repeat-order-{n}/

        // ============== CEK APAKAH MAU UPDATE EXISTING FOLDER ==============
        if (repeatFromLoanId) {
          const existingFolder = await this.findFolderByLoanId(
            bucket,
            customerPrefix,
            repeatFromLoanId,
          );

          if (existingFolder) {
            // Found existing folder → UPDATE
            targetPengajuanIndex = existingFolder.pengajuanIndex;
            isUpdate = true;
            originalLoanId = repeatFromLoanId;
            this.logger.log(
              `UPDATING existing folder: repeat-order-${targetPengajuanIndex}`,
            );
          } else {
            // Not found → CREATE NEW dengan nextPengajuanIndex
            this.logger.log(
              `Creating NEW folder: repeat-order-${nextPengajuanIndex}`,
            );
          }
        } else {
          // No repeatFromLoanId → ALWAYS CREATE NEW
          this.logger.log(
            `Creating NEW folder: repeat-order-${nextPengajuanIndex}`,
          );
        }

        pengajuanFolder = `${customerPrefix}repeat-order-${targetPengajuanIndex}/`;
      }

      const savedFiles: Record<string, FileMetadata[]> = {};

      // ============== UPLOAD FILES ==============
      for (const [field, fileList] of Object.entries(files)) {
        if (!fileList || fileList.length === 0) continue;

        savedFiles[field] = [];

        for (const file of fileList) {
          const ext = file.originalname.split('.').pop();
          const newFileName = `${customerName}-${field}.${ext}`;

          const metadata = await this.uploadSingleFile(
            bucket,
            pengajuanFolder,
            file,
            newFileName,
            hasValidFiles ? 'repeat-order' : undefined,
          );

          savedFiles[field].push(metadata);
        }
      }

      return {
        savedFiles,
        isUpdate,
        pengajuanFolder,
        originalLoanId,
      };
    } catch (error) {
      this.logger.error(`Error saving pengajuan files: ${error.message}`);
      throw error;
    }
  }

  async saveApprovalRecommedationFiles(
    customerId: number,
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
        // Ambil ekstensi file
        const ext = file.originalname.split('.').pop();
        // Buat nama file baru: <nama_nasabah>-<tipe_field>.<ext>
        const newFileName = `${customerName}-${field}.${ext}`;

        // Upload pake nama baru
        const metadata = await this.uploadSingleFile(
          bucket,
          prefix,
          file,
          newFileName,
          'bi-check/',
        );
        savedFiles[field].push(metadata);
      }
    }

    return savedFiles;
  }

  private async uploadSingleFile(
    bucket: string,
    prefix: string,
    file: Express.Multer.File,
    customFileName?: string,
    type_prefix?: string,
  ): Promise<FileMetadata> {
    try {
      const { encrypted, iv } = this.encrypt(file.buffer);

      const filenameToUse = customFileName || file.originalname;
      const encryptedName = `${prefix}${filenameToUse}.enc`;

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

      // ============== PARSE PREFIX UNTUK URL ==============
      const prefixParser = (prefix: string) => {
        const trimmed = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
        const parts = trimmed.split('/');

        if (parts.length === 1) {
          // Root: "3171009000006428-Shi Ning Sheh"
          const firstDashIndex = parts[0].indexOf('-');
          const id = parts[0].substring(0, firstDashIndex);
          const name = parts[0].substring(firstDashIndex + 1); // JANGAN LOWERCASE!
          return { id, name, subfolder: null };
        } else {
          // Nested: "3171009000006428-Shi Ning Sheh/repeat-order-1"
          const firstDashIndex = parts[0].indexOf('-');
          const id = parts[0].substring(0, firstDashIndex);
          const name = parts[0].substring(firstDashIndex + 1); // JANGAN LOWERCASE!
          const subfolder = parts[1];
          return { id, name, subfolder };
        }
      };

      const { id, name, subfolder } = prefixParser(prefix);

      // ============== BUILD URL ==============
      let url: string;
      if (subfolder) {
        url = `${process.env.BACKEND_URI}/storage/repeat-order/${id}/${name}/${subfolder}/${filenameToUse}`;
      } else {
        url = `${process.env.BACKEND_URI}/storage/${id}/${name}/${filenameToUse}`;
      }

      this.logger.log(`File uploaded: ${encryptedName}`);

      return {
        originalName: file.originalname,
        mimetype: file.mimetype,
        encryptedName: encryptedName,
        size: file.size,
        url: url,
      };
    } catch (error: any) {
      console.log('Error uploading file', error);
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  // ============== READ/GET ==============

  async getFile(
    customerId: number,
    customerName: string,
    filename: string,
    isDraft: boolean = false,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }> {
    try {
      const bucket = this.getBucketName(isDraft);
      const prefix = this.getCustomerPrefix(customerId, customerName);
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
      const decryptedBuffer = this.decrypt(encryptedBuffer, iv);

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

  async getFilesForApprovalRecommendations(
    customerId: number,
    customerName: string,
    filename: string,
    isDraft: boolean = false,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }> {
    try {
      const bucket = this.approvalRecommendationBucket;
      const prefix = this.getCustomerPrefix(customerId, customerName);
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
      const decryptedBuffer = this.decrypt(encryptedBuffer, iv);

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

  async getFilesByPengajuanIndex(
    customerId: number,
    customerName: string,
    pengajuanIndex: number,
    isDraft: boolean = false,
  ): Promise<FileMetadata[]> {
    try {
      const bucket = this.getBucketName(isDraft);
      const customerPrefix = this.getCustomerPrefix(customerId, customerName);
      const pengajuanFolder = `${customerPrefix}pengajuan-${pengajuanIndex}/`;

      const stream = this.minioClient.listObjectsV2(
        bucket,
        pengajuanFolder,
        true,
      );

      const files: FileMetadata[] = [];

      for await (const obj of stream) {
        const stat = await this.minioClient.statObject(bucket, obj.name);
        const metadata = stat.metaData;

        files.push({
          originalName:
            metadata['x-original-filename'] || metadata['X-Original-Filename'],
          encryptedName: obj.name,
          mimetype:
            metadata['x-original-mimetype'] || metadata['X-Original-Mimetype'],
          size: parseInt(
            metadata['x-original-size'] || metadata['X-Original-Size'] || '0',
          ),
          url: `${bucket}/${obj.name}`,
        });
      }

      return files;
    } catch (error) {
      this.logger.error(
        `Error getting files by pengajuan index: ${error.message}`,
      );
      throw error;
    }
  }

  // ============== UPDATE ==============

  async updateFile(
    customerId: number,
    customerName: string,
    filename: string,
    file: Express.Multer.File,
    isDraft: boolean = false,
  ): Promise<FileMetadata> {
    try {
      const bucket = this.getBucketName(isDraft);
      const prefix = this.getCustomerPrefix(customerId, customerName);
      const encryptedName = filename.endsWith('.enc')
        ? `${prefix}${filename}`
        : `${prefix}${filename}.enc`;

      // Check if file exists
      try {
        await this.minioClient.putObject(
          bucket,
          encryptedName,
          file.buffer,
          file.size,
        );
      } catch (error) {
        console.log(error);
        throw new NotFoundException(`File not found: ${filename}`);
      }

      // Encrypt new file
      const { encrypted, iv } = this.encrypt(file.buffer);

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

      this.logger.log(`File updated: ${encryptedName}`);

      return {
        originalName: file.originalname,
        encryptedName,
        mimetype: file.mimetype,
        size: file.size,
        url: `${bucket}/${encryptedName}`,
      };
    } catch (error) {
      this.logger.error(`Error updating file: ${error.message}`);
      throw error;
    }
  }

  async updateFileDirectory(
    customerId: number,
    oldCustomerName: string,
    newCustomerName: string,
    // filename: string, // boleh diabaikan kalau mau rename seluruh folder
  ) {
    const bucket = 'customer-files';
    const oldPrefix = `${customerId}-${oldCustomerName}/`;
    const newPrefix = `${customerId}-${newCustomerName}/`;

    const objects: MinioObject[] = [];
    const stream = this.minioClient.listObjectsV2(bucket, oldPrefix, true);

    // 1️⃣ Ambil semua file yang ada di folder lama
    for await (const obj of stream) {
      objects.push(obj);
    }

    if (objects.length === 0) {
      throw new Error(`No files found in ${oldPrefix}`);
    }

    // 2️⃣ Copy semua file ke prefix baru
    for (const obj of objects) {
      const newKey = obj.name.replace(oldPrefix, newPrefix);
      await this.minioClient.copyObject(
        bucket,
        newKey,
        `/${bucket}/${obj.name}`,
      );
    }

    // 3️⃣ Hapus file lama setelah berhasil dicopy
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
    customerId: number,
    customerName: string,
    isDraft: boolean = false,
  ): Promise<FileMetadata[]> {
    try {
      const bucket = this.getBucketName(isDraft);
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
    customerId: number,
    customerName: string,
    filename: string,
    isDraft: boolean = false,
  ): Promise<void> {
    try {
      const bucket = this.getBucketName(isDraft);
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
    customerId: number,
    customerName: string,
    isDraft: boolean = false,
  ): Promise<void> {
    try {
      const bucket = this.getBucketName(isDraft);
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
