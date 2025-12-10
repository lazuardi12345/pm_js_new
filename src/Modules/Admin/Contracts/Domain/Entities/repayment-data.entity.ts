export class RepaymentData {
  constructor(
    public readonly id_pinjam: string,
    public readonly nama_konsumen: string,
    public readonly divisi: string = 'Bukan Borongan',
    public readonly tgl_pencairan: Date,
    public readonly pokok_pinjaman: number,
    public readonly jumlah_tenor_seharusnya: string,
    public readonly cicilan_per_bulan: number,
    public readonly pinjaman_ke: number,
    public readonly sisa_tenor: string,
    public readonly sisa_pinjaman: number,
    public readonly id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,
    public updated_at?: Date,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.id_pinjam) throw new Error('id_pinjam wajib diisi');
    if (!this.nama_konsumen) throw new Error('nama konsumen wajib diisi');
    if (!(this.tgl_pencairan instanceof Date))
      throw new Error('tanggal pencairan harus berupa Date');
    if (this.pokok_pinjaman <= 0)
      throw new Error('pokok pinjaman harus lebih dari nol');
    if (this.cicilan_per_bulan <= 0)
      throw new Error('cicilan per bulan harus lebih dari nol');
    if (this.pinjaman_ke <= 0)
      throw new Error('pinjaman ke - n harus lebih dari nol');
    if (this.sisa_pinjaman < 0)
      throw new Error('sisa pinjaman tidak boleh negatif');
  }
}
