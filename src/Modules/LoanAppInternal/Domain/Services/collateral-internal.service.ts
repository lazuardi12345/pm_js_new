// src/Modules/LoanAppInternal/Domain/Services/collateral-validation.service.ts

import { CollateralInternal } from '../Entities/collateral-internal.entity';
import { PenjaminEnum, RiwayatPinjamPenjaminEnum } from 'src/Shared/Enums/Internal/Collateral.enum';

export class CollateralValidationService {
  /**
   * Validasi apakah nilai penjamin sesuai enum
   */
  static isPenjaminValid(collateral: CollateralInternal): boolean {
    return Object.values(PenjaminEnum).includes(collateral.penjamin);
  }

  /**
   * Validasi apakah riwayat pinjaman penjamin sesuai enum
   */
  static isRiwayatPinjamanValid(collateral: CollateralInternal): boolean {
    if (!collateral.riwayat_pinjam_penjamin) return true; // optional field
    return Object.values(RiwayatPinjamPenjaminEnum).includes(collateral.riwayat_pinjam_penjamin);
  }

  /**
   * Cek apakah data collateral minimal sudah lengkap
   */
  static isCollateralComplete(collateral: CollateralInternal): boolean {
    return collateral.isCollateralComplete();
  }

  /**
   * Jika ada penjamin, cek apakah data pendukungnya lengkap
   */
  static hasValidPenjaminData(collateral: CollateralInternal): boolean {
    if (collateral.penjamin === PenjaminEnum.TIDAK) {
      return true; // tidak perlu penjamin → valid
    }

    // kalau ada penjamin → harus ada nama + foto KTP minimal
    return Boolean(collateral.nama_penjamin && collateral.foto_ktp_penjamin);
  }

  /**
   * Master validasi collateral
   */
  static validateCollateral(collateral: CollateralInternal): boolean {
    if (!this.isPenjaminValid(collateral)) return false;
    if (!this.isRiwayatPinjamanValid(collateral)) return false;
    if (!this.isCollateralComplete(collateral)) return false;
    if (!this.hasValidPenjaminData(collateral)) return false;

    return true;
  }
}
