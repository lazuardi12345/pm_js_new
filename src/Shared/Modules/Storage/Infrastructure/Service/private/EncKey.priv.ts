import * as crypto from 'crypto';

export class EncKey {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;

  constructor() {
    this.key = Buffer.from(process.env.CRYPT_KEY!, 'utf8');
  }

  public encrypt(buffer: Buffer): { encrypted: Buffer; iv: string } {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return {
      encrypted,
      iv: iv.toString('hex'),
    };
  }

  public decrypt(encryptedBuffer: Buffer, ivHex: string): Buffer {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  }

  // string wrapper opsional
  //   public encryptString(value: string) {
  //     return this.encrypt(Buffer.from(value, 'utf8'));
  //   }

  //   public decryptString(payload: { encrypted: Buffer; iv: string }) {
  //     return this.decrypt(payload.encrypted, payload.iv).toString('utf8');
  //   }
}
