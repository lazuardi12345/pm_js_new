import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';
import { DetailInstallmentItemsExternal } from './detail-installment-items-external.entity';

export class OtherExistLoansExternal {
  constructor(
    public loanAppExternal: { id: number },
    public cicilan_lain: CicilanLainEnum,

    public id?: number,
    public validasi_pinjaman_lain?: boolean,
    public catatan?: string,

    public created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date,
  ) {
    // this.validate();
  }

  // private validate() {
  //   if (!this.nasabah?.id) {
  //     throw new Error('ID nasabah wajib diisi.');
  //   }

  //   if (!this.nama_pembiayaan || this.nama_pembiayaan.trim() === '') {
  //     throw new Error('Nama pembiayaan wajib diisi.');
  //   }

  //   if (this.cicilan_lain === null || this.cicilan_lain === undefined) {
  //     throw new Error('Status cicilan lain wajib dipilih.');
  //   }

  //   if (
  //     typeof this.cicilan_perbulan !== 'number' ||
  //     isNaN(this.cicilan_perbulan) ||
  //     this.cicilan_perbulan <= 0
  //   ) {
  //     throw new Error('Cicilan per bulan harus lebih besar dari nol.');
  //   }

  //   if (
  //     typeof this.sisa_tenor !== 'number' ||
  //     isNaN(this.sisa_tenor) ||
  //     this.sisa_tenor <= 0
  //   ) {
  //     throw new Error('Sisa tenor harus lebih besar dari nol.');
  //   }
  // }
}
