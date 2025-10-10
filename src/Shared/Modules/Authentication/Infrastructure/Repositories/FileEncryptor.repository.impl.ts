import crypto from 'crypto';
import fs from 'fs';
import { IFileEncryptorRepository } from '../../Domain/Repositories/FileEncryptor.repository';

export const algorithm = 'aes-256-cbc';

const keyEnv = process.env.CRYPT_KEY;
const ivEnv = process.env.CRYPT_IV;

if (!keyEnv || !ivEnv) {
  throw new Error('CRYPT_KEY or CRYPT_IV not defined in env');
}

// Convert env string ke buffer. Pastikan panjangnya: key=32 bytes, iv=16 bytes
export const key = Buffer.from(keyEnv, 'utf-8'); // misal keyEnv = 64 hex chars
export const iv = Buffer.from(ivEnv, 'utf-8'); // misal ivEnv = 32 hex chars

export class FileEncryptorRepositoryImpl implements IFileEncryptorRepository {
  async encryptFile(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);

      input.pipe(cipher).pipe(output);

      output.on('finish', resolve);
      output.on('error', reject);
    });
  }

  async decryptFile(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);

      input.pipe(decipher).pipe(output);

      output.on('finish', resolve);
      output.on('error', reject);
    });
  }
}
