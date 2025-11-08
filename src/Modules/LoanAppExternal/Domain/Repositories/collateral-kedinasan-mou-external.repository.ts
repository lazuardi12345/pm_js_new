// Domain/Repositories/approval-external.repository.ts
import { CollateralByKedinasanMOU } from "../Entities/collateral-kedinasan-mou-external.entity";

export const COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY = 'COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY';

export interface ICollateralByKedinasanRepository {
  findById(id: number): Promise<CollateralByKedinasanMOU  | null>;
  findByPengajuanLuarId(pengajuanLuarId: number): Promise<CollateralByKedinasanMOU []>;
  findAll(): Promise<CollateralByKedinasanMOU []>;
  save(address: CollateralByKedinasanMOU ): Promise<CollateralByKedinasanMOU >;
  update(
    id: number,
    address: Partial<CollateralByKedinasanMOU >,
  ): Promise<CollateralByKedinasanMOU >;
  delete(id: number): Promise<void>;
}
