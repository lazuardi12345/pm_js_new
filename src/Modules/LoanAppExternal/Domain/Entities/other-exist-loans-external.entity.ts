import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class OtherExistLoansExternal {
  constructor(
    public readonly nasabah: { id: number },
    public readonly cicilan_lain: CicilanLainEnum,
    public readonly nama_pembiayaan: string,
    public readonly cicilan_perbulan: number,
    public readonly sisa_tenor: number,
    public readonly id?: number,
    public readonly total_pinjaman?: string,
    public readonly validasi_pinjaman_lain?: boolean,
    public readonly catatan?: string,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.nama_pembiayaan) {
      throw new Error('Nama pembiayaan wajib diisi.');
    }
    if (this.cicilan_perbulan <= 0) {
      throw new Error('Cicilan per bulan harus lebih besar dari nol.');
    }
    if (this.sisa_tenor <= 0) {
      throw new Error('Sisa tenor harus lebih besar dari nol.');
    }
  }
}
