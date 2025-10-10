// Domain/Repositories/approval-external.repository.ts
import { CollateralByKedinasan } from "../Entities/collateral-kedinasan-external.entity";

export const COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY = 'COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY';

export interface ICollateralByKedinasanRepository {
  findById(id: number): Promise<CollateralByKedinasan | null>;
  findByPengajuanLuarId(pengajuanLuarId: number): Promise<CollateralByKedinasan[]>;
  findAll(): Promise<CollateralByKedinasan[]>;
  save(address: CollateralByKedinasan): Promise<CollateralByKedinasan>;
  update(
    id: number,
    address: Partial<CollateralByKedinasan>,
  ): Promise<CollateralByKedinasan>;
  delete(id: number): Promise<void>;
}
