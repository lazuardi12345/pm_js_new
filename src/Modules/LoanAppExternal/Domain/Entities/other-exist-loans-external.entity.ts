import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class OtherExistLoansExternal {
  constructor(
    public readonly nasabahId: number,
    public readonly cicilanLain: CicilanLainEnum,
    public readonly namaPembiayaan: string,
    public readonly cicilanPerbulan: number,
    public readonly sisaTenor: number,
    public readonly id?: number,
    public readonly totalPinjaman?: string,
    public readonly validasiPinjamanLain?: boolean,
    public readonly catatan?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.namaPembiayaan) {
      throw new Error('Nama pembiayaan wajib diisi.');
    }
    if (this.cicilanPerbulan <= 0) {
      throw new Error('Cicilan per bulan harus lebih besar dari nol.');
    }
    if (this.sisaTenor <= 0) {
      throw new Error('Sisa tenor harus lebih besar dari nol.');
    }
    // Validasi lain sesuai aturan bisnis domain
  }
}
