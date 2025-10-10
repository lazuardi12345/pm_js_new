import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';

export class LoanGuarantorExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly hubunganPenjamin: HubunganPenjaminEnum,
    public readonly namaPenjamin: string,
    public readonly pekerjaanPenjamin: string,
    public readonly penghasilanPenjamin: number,
    public readonly noHpPenjamin: string,
    public readonly persetujuanPenjamin: PersetujuanPenjaminEnum,
    public readonly fotoKtpPenjamin: string,
    public readonly id?: number,
    public readonly validasiPenjamin?: boolean,
    public readonly catatan?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (this.penghasilanPenjamin < 0) {
      throw new Error('Penghasilan penjamin harus bernilai positif.');
    }
    if (!this.namaPenjamin) {
      throw new Error('Nama penjamin wajib diisi.');
    }
    if (!this.noHpPenjamin) {
      throw new Error('Nomor HP penjamin wajib diisi.');
    }
    // Bisa tambah validasi lain sesuai kebutuhan domain
  }
}
