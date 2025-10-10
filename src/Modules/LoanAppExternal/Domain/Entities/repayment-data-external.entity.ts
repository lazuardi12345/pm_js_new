export class RepaymentData {
  constructor(
    public readonly idPinjam: string,
    public readonly namaKonsumen: string,
    public readonly divisi: string = 'Bukan Borongan',
    public readonly tglPencairan: Date,
    public readonly pokokPinjaman: number,
    public readonly jumlahTenorSeharusnya: string,
    public readonly cicilanPerbulan: number,
    public readonly pinjamanKe: number,
    public readonly sisaTenor: string,
    public readonly sisaPinjaman: number,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.idPinjam) throw new Error('idPinjam wajib diisi');
    if (!this.namaKonsumen) throw new Error('namaKonsumen wajib diisi');
    if (!(this.tglPencairan instanceof Date)) throw new Error('tglPencairan harus berupa Date');
    if (this.pokokPinjaman <= 0) throw new Error('pokokPinjaman harus lebih dari nol');
    if (this.cicilanPerbulan <= 0) throw new Error('cicilanPerbulan harus lebih dari nol');
    if (this.pinjamanKe <= 0) throw new Error('pinjamanKe harus lebih dari nol');
    if (this.sisaPinjaman < 0) throw new Error('sisaPinjaman tidak boleh negatif');
  }
}
