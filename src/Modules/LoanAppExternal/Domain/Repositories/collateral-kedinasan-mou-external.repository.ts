// Domain/Repositories/approval-external.repository.ts
import { CollateralByKedinasan_MOU } from '../Entities/collateral-kedinasan-mou-external.entity';

export const COLLATERAL_KEDINASAN_MOU_EXTERNAL_REPOSITORY =
  'COLLATERAL_KEDINASAN_MOU_EXTERNAL_REPOSITORY';

export interface ICollateralByKedinasanMOURepository {
  findById(id: number): Promise<CollateralByKedinasan_MOU | null>;
  findByPengajuanLuarId(
    pengajuanLuarId: number,
  ): Promise<CollateralByKedinasan_MOU[]>;
  findAll(): Promise<CollateralByKedinasan_MOU[]>;
  save(address: CollateralByKedinasan_MOU): Promise<CollateralByKedinasan_MOU>;
  update(
    id: number,
    address: Partial<CollateralByKedinasan_MOU>,
  ): Promise<CollateralByKedinasan_MOU>;
  delete(id: number): Promise<void>;
}
