import { FamilyInternal } from "../Entities/family-internal.entity";

export const FAMILY_INTERNAL_REPOSITORY = Symbol('FAMILY_INTERNAL_REPOSITORY');

export interface IFamilyInternalRepository {
  findByClientId(clientId: number): unknown;
  findById(id: number): Promise<FamilyInternal | null>;
  findByNasabahId(nasabahId: number): Promise<FamilyInternal[]>;
  findAll(): Promise<FamilyInternal[]>;
  save(address: FamilyInternal): Promise<FamilyInternal>;
  update(
    id: number,
    address: Partial<FamilyInternal>,
  ): Promise<FamilyInternal>;
  delete(id: number): Promise<void>;
  // delete(id: number): Promise<void>;
}
