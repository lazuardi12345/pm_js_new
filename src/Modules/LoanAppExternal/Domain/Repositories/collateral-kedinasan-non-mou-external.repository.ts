// Domain/Repositories/approval-external.repository.ts
import { CollateralByKedinasan_Non_MOU } from '../Entities/collateral-kedinasan-non-mou-external.entity';

export const COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY =
  'COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY';

export interface ICollateralByKedinasan_Non_MOU_Repository {
  findById(id: number): Promise<CollateralByKedinasan_Non_MOU | null>;
  findByPengajuanLuarId(
    pengajuanLuarId: number,
  ): Promise<CollateralByKedinasan_Non_MOU[]>;
  findAll(): Promise<CollateralByKedinasan_Non_MOU[]>;
  save(
    address: CollateralByKedinasan_Non_MOU,
  ): Promise<CollateralByKedinasan_Non_MOU>;
  update(
    id: number,
    address: Partial<CollateralByKedinasan_Non_MOU>,
  ): Promise<CollateralByKedinasan_Non_MOU>;
  delete(id: number): Promise<void>;
}
