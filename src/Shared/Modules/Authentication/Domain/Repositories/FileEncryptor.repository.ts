export interface IFileEncryptorRepository {
  encryptFile(inputPath: string, outputPath: string): Promise<void>;
  decryptFile(inputPath: string, outputPath: string): Promise<void>;
}