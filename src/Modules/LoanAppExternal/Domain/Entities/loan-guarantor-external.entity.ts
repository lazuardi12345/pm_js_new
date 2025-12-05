import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';

export class LoanGuarantorExternal {
  constructor(
    public readonly nasabah: { id: number },
    public readonly hubungan_penjamin: HubunganPenjaminEnum,
    public readonly nama_penjamin: string,
    public readonly pekerjaan_penjamin: string,
    public readonly penghasilan_penjamin: number,
    public readonly no_hp_penjamin: string,
    public readonly persetujuan_penjamin: PersetujuanPenjaminEnum,
    public readonly foto_ktp_penjamin?: string,
    public readonly id?: number,
    public readonly validasi_penjamin?: boolean,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (this.penghasilan_penjamin < 0) {
      throw new Error('Penghasilan penjamin harus bernilai positif.');
    }
    if (!this.nama_penjamin) {
      throw new Error('Nama penjamin wajib diisi.');
    }
    if (!this.no_hp_penjamin) {
      throw new Error('Nomor HP penjamin wajib diisi.');
    }
    // Bisa tambah validasi lain sesuai kebutuhan domain
  }
}
