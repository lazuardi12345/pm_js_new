// src/Modules/LoanAppInternal/Domain/Entities/collateral-internal.entity.ts
import {
  PenjaminEnum,
  RiwayatPinjamPenjaminEnum,
} from 'src/Shared/Enums/Internal/Collateral.enum';

export class CollateralInternal {
  constructor(
    // === Immutable ===
    public readonly nasabah: {id: number}, // ID of ClientInternal
    public readonly jaminan_hrd: string,
    public readonly jaminan_cg: string,
    public readonly penjamin: PenjaminEnum,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    // === Mutable ===
    public nama_penjamin?: string,
    public lama_kerja_penjamin?: string,
    public bagian?: string,
    public absensi?: string,
    public riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum,
    public riwayat_nominal_penjamin?: number,
    public riwayat_tenor_penjamin?: number,
    public sisa_pinjaman_penjamin?: number,
    public jaminan_cg_penjamin?: string,
    public status_hubungan_penjamin?: string,
    public foto_ktp_penjamin?: string,
    public foto_id_card_penjamin?: string,
    public updated_at?: Date,
  ) {}

  // === Business Rules ===
  public isCollateralComplete(): boolean {
    return (
      this.jaminan_hrd.trim().length > 0 &&
      this.jaminan_cg.trim().length > 0 &&
      this.penjamin !== PenjaminEnum.TIDAK
    );
  }

  public hasValidPenjaminHistory(): boolean {
    return this.riwayat_pinjam_penjamin === RiwayatPinjamPenjaminEnum.ADA;
  }

  public hasRemainingDebt(): boolean {
    return (this.sisa_pinjaman_penjamin ?? 0) > 0;
  }

  public hasProofDocuments(): boolean {
    return !!this.foto_ktp_penjamin && !!this.foto_id_card_penjamin;
  }

  // === Update Methods ===
  public updatePenjaminInfo(
    nama: string,
    lama_kerja: string,
    bagian: string,
    absensi?: string,
  ): void {
    this.nama_penjamin = nama;
    this.lama_kerja_penjamin = lama_kerja;
    this.bagian = bagian;
    this.absensi = absensi;
    this.updated_at = new Date();
  }

  public updateRiwayat(
    status: RiwayatPinjamPenjaminEnum,
    nominal?: number,
    tenor?: number,
    sisa?: number,
  ): void {
    this.riwayat_pinjam_penjamin = status;
    this.riwayat_nominal_penjamin = nominal;
    this.riwayat_tenor_penjamin = tenor;
    this.sisa_pinjaman_penjamin = sisa;
    this.updated_at = new Date();
  }

  public updateDokumen(foto_ktp?: string, foto_id_card?: string): void {
    this.foto_ktp_penjamin = foto_ktp;
    this.foto_id_card_penjamin = foto_id_card;
    this.updated_at = new Date();
  }
}
