// Domain/Repositories/approval-external.repository.ts
import { CollateralByBPKB } from "../Entities/collateral-bpkb-external.entity";

export const COLLATERAL_BPKB_EXTERNAL_REPOSITORY = 'COLLATERAL_BPKB_EXTERNAL_REPOSITORY';

export interface ICollateralByBPKBRepository {
  findById(id: number): Promise<CollateralByBPKB | null>;
  findByPengajuanLuarId(pengajuanLuarId: number): Promise<CollateralByBPKB[]>;
  findAll(): Promise<CollateralByBPKB[]>;
  save(address: CollateralByBPKB): Promise<CollateralByBPKB>;
  update(
    id: number,
    address: Partial<CollateralByBPKB>,
  ): Promise<CollateralByBPKB>;
  delete(id: number): Promise<void>;
}
