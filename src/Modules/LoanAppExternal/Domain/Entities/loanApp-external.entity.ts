import {
  JenisPembiayaanEnum,
  StatusPinjamanEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';

export class LoanApplicationExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly jenisPembiayaan: JenisPembiayaanEnum,
    public readonly nominalPinjaman: number,
    public readonly tenor: number,
    public readonly berkasJaminan: string,
    public readonly statusPinjaman: StatusPinjamanEnum = StatusPinjamanEnum.BARU,
    public readonly id?: number,
    public readonly pinjamanKe?: number,
    public readonly pinjamanTerakhir?: number,
    public readonly sisaPinjaman?: number,
    public readonly realisasiPinjaman?: string,
    public readonly cicilanPerbulan?: number,
    public readonly statusPengajuan: StatusPengajuanEnum = StatusPengajuanEnum.PENDING,
    public readonly validasiPengajuan?: boolean,
    public readonly catatan?: string,
    public readonly catatanSpv?: string,
    public readonly catatanMarketing?: string,
    public readonly isBanding: boolean = false,
    public readonly alasanBanding?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {
    this.validate();
  }

  private validate() {
    if (this.nominalPinjaman <= 0) {
      throw new Error('Nominal pinjaman harus lebih besar dari nol.');
    }
    if (this.tenor <= 0) {
      throw new Error('Tenor harus lebih besar dari nol.');
    }
    if (!this.berkasJaminan) {
      throw new Error('Berkas jaminan wajib diisi.');
    }
    // Tambah validasi domain sesuai aturan bisnis
  }
}
