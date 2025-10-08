import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import {
  IFileStorageRepository,
  FileMetadata,
} from '../../Domain/Repositories/IFileStorage.repository';

@Injectable()
export class MinioFileStorageService implements IFileStorageRepository {
  private readonly logger = new Logger(MinioFileStorageService.name);
  private minioClient: Minio.Client;

  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly mainBucket = 'customer-files';
  private readonly draftBucket = 'customer-drafts';

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
    return `${customerId}-${customerName.replace(/\s+/g, '_')}/`;
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
        const metadata = await this.uploadSingleFile(bucket, prefix, file);
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
        const metadata = await this.uploadSingleFile(bucket, prefix, file);
        savedFiles[field].push(metadata);
      }
    }

    return savedFiles;
  }

  private async uploadSingleFile(
    bucket: string,
    prefix: string,
    file: Express.Multer.File,
  ): Promise<FileMetadata> {
    try {
      // Encrypt file
      const { encrypted, iv } = this.encrypt(file.buffer);
      const encryptedName = `${prefix}${file.originalname}.enc`;

      // Upload to MinIO
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

      this.logger.log(`File uploaded: ${encryptedName}`);

      return {
        originalName: file.originalname,
        encryptedName,
        mimetype: file.mimetype,
        size: file.size,
        url: `${bucket}/${encryptedName}`,
      };
    } catch (error) {
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
        await this.minioClient.statObject(bucket, encryptedName);
      } catch (error) {
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
