import { AddressExternal } from "../Entities/address-external.entity";

export const ADDRESS_EXTERNAL_REPOSITORY = 'ADDRESS_EXTERNAL_REPOSITORY';

export interface IAddressExternalRepository {
  findById(id: number): Promise<AddressExternal | null>;
  findByNasabahId(nasabahId: number): Promise<AddressExternal[]>;
  findAll(): Promise<AddressExternal[]>;
  save(address: AddressExternal): Promise<AddressExternal>;
  update(
    id: number,
    address: Partial<AddressExternal>,
  ): Promise<AddressExternal>;
  delete(id: number): Promise<void>;
}
