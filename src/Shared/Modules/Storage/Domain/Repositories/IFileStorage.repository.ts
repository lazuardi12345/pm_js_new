import { REQUEST_TYPE } from '../../Infrastructure/Service/Interface/RequestType.interface';

export const FILE_STORAGE_SERVICE = Symbol('FILE_STORAGE_SERVICE');

export interface FileMetadata {
  originalName: string;
  encryptedName: string;
  mimetype: string;
  size: number;
  url: string;
  encryptedPath?: string;
  encryptedCustomerIdIv?: string;
  encryptedCustomerNameIv?: string;
  repeatOrderFolder?: string;
}

export interface LoanMetadata {
  loanId: number | null;
  nasabahId: number;
  nominalPinjaman: number;
  tenor: number;
}

export interface PengajuanUploadResult {
  savedFiles: Record<string, FileMetadata[]>;
  isUpdate: boolean;
  pengajuanFolder: string;
  originalLoanId?: number;
}

export interface IFileStorageRepository {
  // Create/Upload
  saveFiles(
    customerNIN: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    type?: REQUEST_TYPE,
  ): Promise<Record<string, FileMetadata[]>>;

  saveApprovalRecommedationFiles(
    customerNIN: string,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, FileMetadata[]>>;

  saveSurveyPhotos(
    customerNIN: string,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, FileMetadata[]>>;

  // Read/Get
  getFile(
    encryptedPrefix: string,
    filename: string,
    type: REQUEST_TYPE,
    roFolder?: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  getFilesForApprovalRecommendations(
    customerNIN: string,
    customerName: string,
    filename: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  getSurveyPhoto(
    customerNIN: string,
    customerName: string,
    filename: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  //! DEL:  List files
  // listFiles(
  //   customerNIN: string,
  //   customerName: string,
  //   type?: REQUEST_TYPE,
  // ): Promise<FileMetadata[]>;

  // Update
  updateFile(
    customerId_OR_URL: string,
    customerName: string,
    filename: string,
    file: Express.Multer.File,
    type?: REQUEST_TYPE,
    isRepeatOrder?: boolean,
    repeatOrderPath?: string,
  ): Promise<FileMetadata>;

  //! DEL: updateFileDirectory(
  //   customerNIN: string,
  //   oldCustomerName: string,
  //   newCustomerName: string,
  // ): Promise<{
  //   oldPrefix: string;
  //   newPrefix: string;
  //   totalMoved: number;
  //   message: string;
  // }>;

  // Delete
  deleteFile(
    customerNIN: string,
    customerName: string,
    filename: string,
    type?: REQUEST_TYPE,
  ): Promise<void>;

  deleteCustomerFiles(
    customerNIN: string,
    customerName: string,
    type?: REQUEST_TYPE,
    isRepeatOrder?: boolean,
    repeatOrderPath?: string,
  ): Promise<void>;

  saveRepeatOrderFiles(
    customerNIN: number, // ID customer dari DB (e.g., 13)
    customerName: string, // Nama customer (e.g., "Ahmad Suryadi")
    files: Record<string, Express.Multer.File[] | undefined>, // Files yang diupload: { foto_ktp: [file], foto_kk: [file] }
    type: REQUEST_TYPE,
  ): Promise<Record<string, FileMetadata[]>>;
}
