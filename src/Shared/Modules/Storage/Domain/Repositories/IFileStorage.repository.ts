import { REQUEST_TYPE } from '../../Infrastructure/Service/Interface/RequestType.interface';

export const FILE_STORAGE_SERVICE = Symbol('FILE_STORAGE_SERVICE');

export interface FileMetadata {
  originalName: string;
  encryptedName: string;
  mimetype: string;
  size: number;
  url: string;
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
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    type?: REQUEST_TYPE,
  ): Promise<Record<string, FileMetadata[]>>;

  saveDraftsFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    type?: REQUEST_TYPE,
  ): Promise<Record<string, FileMetadata[]>>;

  saveApprovalRecommedationFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, FileMetadata[]>>;

  // Read/Get
  getFile(
    customerId: number,
    customerName: string,
    filename: string,
    type?: REQUEST_TYPE,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  getFilesForApprovalRecommendations(
    customerId: number,
    customerName: string,
    filename: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  getFilesForRepeatOrders(
    customerId: number,
    customerName: string,
    filename: string,
    index: number,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  // List files
  listFiles(
    customerId: number,
    customerName: string,
    type?: REQUEST_TYPE,
  ): Promise<FileMetadata[]>;

  // Update
  updateFile(
    customerId: number,
    customerName: string,
    filename: string,
    file: Express.Multer.File,
    type?: REQUEST_TYPE,
  ): Promise<FileMetadata>;

  updateFileDirectory(
    customerId: number,
    oldCustomerName: string,
    newCustomerName: string,
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
    type?: REQUEST_TYPE,
  ): Promise<void>;

  deleteCustomerFiles(
    customerId: number,
    customerName: string,
    type?: REQUEST_TYPE,
  ): Promise<void>;

  saveRepeatOrderFiles(
    customerId: number, // ID customer dari DB (e.g., 13)
    customerName: string, // Nama customer (e.g., "Ahmad Suryadi")
    pengajuanIndex: number, // Index pengajuan awal (e.g., 1, 2, 3) - bisa di-override kalau repeat order ketemu
    files: Record<string, Express.Multer.File[] | undefined>, // Files yang diupload: { foto_ktp: [file], foto_kk: [file] }
    repeatFromLoanId?: number, // Optional: loan_id LAMA yang mau di-repeat (untuk cek apakah update atau create new)
    loanMetadata?: LoanMetadata, // Optional: Data loan BARU (loan_id, nasabah_id, nominal, tenor)
  ): Promise<PengajuanUploadResult>;

  getNextPengajuanIndex(
    customerId: number,
    customerName: string,
    type?: REQUEST_TYPE,
  ): Promise<number>;

  getFilesByPengajuanIndex(
    customerId: number,
    customerName: string,
    pengajuanIndex: number,
    type?: REQUEST_TYPE,
  ): Promise<FileMetadata[]>;
}
