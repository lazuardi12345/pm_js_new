// domain/services/address-validation.service.ts
import { AddressInternal } from '../Entities/address-internal.entity';
import { DomisiliEnum, StatusRumahEnum } from 'src/Shared/Enums/Internal/Address.enum';

export class AddressValidationService {
  /**
   * Cek apakah domisili valid sesuai enum
   */
  static isDomisiliValid(address: AddressInternal): boolean {
    return Object.values(DomisiliEnum).includes(address.domisili);
  }

  /**
   * Cek apakah status rumah valid sesuai enum
   */
  static isStatusRumahValid(address: AddressInternal): boolean {
    return Object.values(StatusRumahEnum).includes(address.status_rumah);
  }

  /**
   * Validasi seluruh alamat nasabah
   * - Domisili harus valid
   * - Status rumah harus valid
   */
  static validateAddresses(addresses: AddressInternal[]): boolean {
    for (const addr of addresses) {
      if (!this.isDomisiliValid(addr)) return false;
      if (!this.isStatusRumahValid(addr)) return false;
    }
    return true;
  }
}
