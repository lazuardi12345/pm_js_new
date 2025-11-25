import * as crypto from 'crypto';

export class EncKey {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly fixedIv: Buffer;

  constructor() {
    this.key = Buffer.from(process.env.CRYPT_KEY!, 'hex');
    this.fixedIv = Buffer.from(process.env.CRYPT_IV!, 'hex');

    if (this.key.length !== 32) {
      throw new Error(
        `Invalid CRYPT_KEY length: ${this.key.length} bytes (expected 32)`,
      );
    }
    if (this.fixedIv.length !== 16) {
      throw new Error(
        `Invalid CRYPT_IV length: ${this.fixedIv.length} bytes (expected 16)`,
      );
    }
  }

  public encrypt(buffer: Buffer): { encrypted: Buffer; iv: string } {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      this.fixedIv,
    );
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return {
      encrypted,
      iv: this.fixedIv.toString('hex'),
    };
  }

  public decrypt(encryptedBuffer: Buffer, ivHex?: string): Buffer {
    const iv = ivHex ? Buffer.from(ivHex, 'hex') : this.fixedIv;
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  }

  public encryptString(value: string) {
    return this.encrypt(Buffer.from(value, 'utf8'));
  }

  public decryptString(payload: { encrypted: Buffer; iv?: string }) {
    return this.decrypt(payload.encrypted, payload.iv).toString('utf8');
  }
}
