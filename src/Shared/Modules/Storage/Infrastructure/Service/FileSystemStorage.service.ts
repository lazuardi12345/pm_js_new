import { IFileStorageService } from '../../Domain/Services/IFileStorage.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  algorithm,
  key,
  iv,
} from 'src/Shared/Modules/Authentication/Infrastructure/Repositories/FileEncryptor.repository.impl';
export class LocalFileStorageService implements IFileStorageService {
  private encrypt(buffer: Buffer): Buffer {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return Buffer.concat([cipher.update(buffer), cipher.final()]);
  }

  private decrypt(buffer: Buffer): Buffer {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([decipher.update(buffer), decipher.final()]);
  }

  private ensureDir(basePath: string) {
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }
  }

  private async saveToDisk(basePath: string, fileList: Express.Multer.File[]) {
    const savedPaths: string[] = [];

    for (const file of fileList) {
      const filePath = path.join(basePath, file.originalname + '.enc'); // .enc
      const encryptedBuffer = this.encrypt(file.buffer);
      fs.writeFileSync(filePath, encryptedBuffer);
      savedPaths.push(filePath);
    }

    return savedPaths;
  }

  async saveFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, string[]>> {
    const folderName = `${customerId}-${customerName.replace(/\s+/g, '_')}`;
    const basePath = path.join(__dirname, '../../../../uploads', folderName);
    this.ensureDir(basePath);

    const savedPaths: Record<string, string[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList) continue;
      savedPaths[field] = await this.saveToDisk(basePath, fileList);
    }

    return savedPaths;
  }

  async saveDraftsFile(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, string[]>> {
    const folderName = `${customerId}-${customerName.replace(/\s+/g, '_')}`;
    const basePath = path.join(
      __dirname,
      '../../../../draft-uploads',
      folderName,
    );
    this.ensureDir(basePath);

    const savedPaths: Record<string, string[]> = {};

    for (const [field, fileList] of Object.entries(files)) {
      if (!fileList) continue;
      savedPaths[field] = await this.saveToDisk(basePath, fileList);
    }

    return savedPaths;
  }

  async decryptFile(filePath: string): Promise<Buffer> {
    const encryptedBuffer = fs.readFileSync(filePath);
    return this.decrypt(encryptedBuffer);
  }
}
