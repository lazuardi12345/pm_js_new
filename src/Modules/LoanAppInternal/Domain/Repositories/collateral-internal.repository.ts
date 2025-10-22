import { CollateralInternal } from '../Entities/collateral-internal.entity';

export const COLLATERAL_INTERNAL_REPOSITORY = Symbol('COLLATERAL_INTERNAL_REPOSITORY');

export interface ICollateralInternalRepository {
  findByClientId(clientId: number): unknown;
  findByClientId(clientId: number): unknown;
  findById(id: number): Promise<CollateralInternal | null>;
  findByNasabahId(nasabahId: number): Promise<CollateralInternal[]>;
  findAll(): Promise<CollateralInternal[]>;
  save(address: CollateralInternal): Promise<CollateralInternal>;
  update(id: number, address: Partial<CollateralInternal>): Promise<CollateralInternal>;
  delete(id: number): Promise<void>;
  // delete(id: number): Promise<void>;
}
