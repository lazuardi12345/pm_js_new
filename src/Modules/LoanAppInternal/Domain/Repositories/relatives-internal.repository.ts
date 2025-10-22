import { RelativesInternal } from "../Entities/relative-internal.entity";

export const RELATIVE_INTERNAL_REPOSITORY = Symbol('RELATIVE_INTERNAL_REPOSITORY');

export interface IRelativesInternalRepository {
  findByClientId(clientId: number): unknown;
  findById(id: number): Promise<RelativesInternal | null>;
  findByNasabahId(nasabahId: number): Promise<RelativesInternal[]>;
  findAll(): Promise<RelativesInternal[]>;
  save(address: RelativesInternal): Promise<RelativesInternal>;
  update(
    id: number,
    address: Partial<RelativesInternal>,
  ): Promise<RelativesInternal>;
  delete(id: number): Promise<void>;
  // delete(id: number): Promise<void>;
}