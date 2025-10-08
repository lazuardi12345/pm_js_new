// src/Modules/ClientInternal/Domain/Services/client-validation.service.ts

import { ClientInternal } from '../Entities/client-internal.entity';
import { GENDER, MARRIAGE_STATUS } from 'src/Shared/Enums/Internal/Clients.enum';

export class ClientValidationService {
  /**
   * Cek apakah gender valid sesuai enum
   */
  static isGenderValid(client: ClientInternal): boolean {
    return Object.values(GENDER).includes(client.jenis_kelamin);
  }

  /**
   * Cek apakah status pernikahan valid sesuai enum
   */
  static isMarriageStatusValid(client: ClientInternal): boolean {
    return Object.values(MARRIAGE_STATUS).includes(client.status_nikah);
  }

  /**
   * Cek apakah semua field mandatory valid
   * - noKTP panjang 16
   * - gender valid
   * - status nikah valid
   */
  static validateClient(client: ClientInternal): boolean {
    if (!client.isKtpValid()) {
      return false;
    }

    if (!this.isGenderValid(client)) {
      return false;
    }

    if (!this.isMarriageStatusValid(client)) {
      return false;
    }

    return true;
  }
}
