import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class DetailInstallmentItemsExternal {
  constructor(
    public otherExistLoan: { id: number },
    public nama_pembiayaan: string,
    public total_pinjaman: number,
    public cicilan_perbulan: number,
    public sisa_tenor: number,
    public id?: number,
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
