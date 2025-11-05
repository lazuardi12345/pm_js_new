export const FILE_STORAGE_SERVICE = Symbol('FILE_STORAGE_SERVICE');

export interface FileMetadata {
  originalName: string;
  encryptedName: string;
  mimetype: string;
  size: number;
  url: string;
}

export interface LoanMetadata {
  loanId: number;
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
    isDraft?: boolean,
  ): Promise<Record<string, FileMetadata[]>>;

  saveDraftsFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
    isDraft?: boolean,
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
    isDraft?: boolean,
  ): Promise<{ buffer: Buffer; mimetype: string; originalName: string }>;

  getFilesForApprovalRecommendations(
    customerId: number,
    customerName: string,
    filename: string,
    isDraft?: boolean,
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
    isDraft?: boolean,
  ): Promise<void>;

  deleteCustomerFiles(
    customerId: number,
    customerName: string,
    isDraft?: boolean,
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
    isDraft?: boolean,
  ): Promise<number>;

  getFilesByPengajuanIndex(
    customerId: number,
    customerName: string,
    pengajuanIndex: number,
    isDraft?: boolean,
  ): Promise<FileMetadata[]>;
}
