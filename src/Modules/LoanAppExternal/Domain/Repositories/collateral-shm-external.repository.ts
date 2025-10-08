// Domain/Repositories/approval-external.repository.ts
import { CollateralBySHM } from "../Entities/collateral-shm-external.entity";

export const COLLATERAL_SHM_EXTERNAL_REPOSITORY = 'COLLATERAL_SHM_EXTERNAL_REPOSITORY';

export interface ICollateralBySHMRepository {
  findById(id: number): Promise<CollateralBySHM | null>;
  findByPengajuanLuarId(pengajuanLuarId: number): Promise<CollateralBySHM[]>;
  findAll(): Promise<CollateralBySHM[]>;
  save(address: CollateralBySHM): Promise<CollateralBySHM>;
  update(
    id: number,
    address: Partial<CollateralBySHM>,
  ): Promise<CollateralBySHM>;
  delete(id: number): Promise<void>;
}
