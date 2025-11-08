// collateral-umkm.repository.ts
export const COLLATERAL_UMKM_REPOSITORY = 'COLLATERAL_UMKM_REPOSITORY';

import { CollateralByUMKM } from '../Entities/collateral-umkm.entity';

export interface ICollateralByUMKMRepository {
  save(data: CollateralByUMKM): Promise<CollateralByUMKM>;
  update(id: number, data: Partial<CollateralByUMKM>): Promise<CollateralByUMKM>;
  findById(id: number): Promise<CollateralByUMKM | null>;
  findAll(): Promise<CollateralByUMKM[]>;
  delete(id: number): Promise<void>;
}
