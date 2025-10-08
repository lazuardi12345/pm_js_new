import { IFileEncryptorRepository } from "../../Domain/Repositories/FileEncryptor.repository";

export class EncryptFileUseCase {
  constructor(private fileEncryptorService: IFileEncryptorRepository) {}

  async execute(inputPath: string, outputPath: string): Promise<void> {
    return this.fileEncryptorService.decryptFile(inputPath, outputPath);
  }
}
