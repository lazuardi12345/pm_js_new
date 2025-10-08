export const FILE_STORAGE_SERVICE = Symbol('FILE_STORAGE_SERVICE');

export interface IFileStorageService {
  saveFiles(
    customerId: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, string[]>>;
  saveDraftsFile(
    customer_region_id: number,
    customerName: string,
    files: Record<string, Express.Multer.File[] | undefined>,
  ): Promise<Record<string, string[]>>;
}
