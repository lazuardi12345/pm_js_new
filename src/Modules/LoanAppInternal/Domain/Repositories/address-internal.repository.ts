// Domain/Repositories/address-internal.repository.ts
import { AddressInternal } from '../Entities/address-internal.entity';

export const ADDRESS_INTERNAL_REPOSITORY = Symbol('ADDRESS_INTERNAL_REPOSITORY');

export interface IAddressInternalRepository {
  create(arg0: any): unknown;
  findByClientId(clientId: number): unknown;
  findById(id: number): Promise<AddressInternal | null>;
  findByNasabahId(nasabahId: number): Promise<AddressInternal[]>;
  findAll(): Promise<AddressInternal[]>;
  save(address: AddressInternal): Promise<AddressInternal>;
  update(
    id: number,
    address: Partial<AddressInternal>,
  ): Promise<AddressInternal>;
  delete(id: number): Promise<void>;
}
