// Domain/Repositories/approval-external.repository.ts
import { CollateralByBPJS } from "../Entities/collateral-bpjs-external.entity";

export const COLLATERAL_BPJS_EXTERNAL_REPOSITORY = 'COLLATERAL_BPJS_EXTERNAL_REPOSITORY';

export interface ICollateralByBPJSRepository {
  findById(id: number): Promise<CollateralByBPJS | null>;
  findByPengajuanLuarId(pengajuanLuarId: number): Promise<CollateralByBPJS[]>;
  findAll(): Promise<CollateralByBPJS[]>;
  save(address: CollateralByBPJS): Promise<CollateralByBPJS>;
  update(
    id: number,
    address: Partial<CollateralByBPJS>,
  ): Promise<CollateralByBPJS>;
  delete(id: number): Promise<void>;
}
