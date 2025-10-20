export const FILE_STORAGE_SERVICE = Symbol('FILE_STORAGE_SERVICE');

export interface FileMetadata {
  originalName: string;
  encryptedName: string;
  mimetype: string;
  size: number;
  url: string;
}

export interface IFileStorageRepository {
  // Create/Upload
  saveFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    isDraft?: boolean,
  ): Promise<Record<string, FileMetadata[]>>;

  saveDraftsFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    isDraft?: boolean,
  ): Promise<Record<string, FileMetadata[]>>;

  // Read/Get
  getFile(
    customerId: number,
    customerName: string,
    filename: string,
    isDraft?: boolean,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  // List files
  listFiles(
    customerId: number,
    customerName: string,
    isDraft?: boolean,
  ): Promise<FileMetadata[]>;

  // Update
  updateFile(
    customerId: number,
    customerName: string,
    filename: string,
    file: Express.Multer.File,
    isDraft?: boolean,
  ): Promise<FileMetadata>;

  // Update
  // IFileStorageRepository.ts
  updateFileDirectory(
    customerId: number,
    oldCustomerName: string,
    newCustomerName: string,
    // filename: string,
  ): Promise<{
    oldPrefix: string;
    newPrefix: string;
    totalMoved: number;
    message: string;
  }>;

  // Delete
  deleteFile(
    customerId: number,
    customerName: string,
    filename: string,
    isDraft?: boolean,
  ): Promise<void>;

  // Delete all files for customer
  deleteCustomerFiles(
    customerId: number,
    customerName: string,
    isDraft?: boolean,
  ): Promise<void>;
}
