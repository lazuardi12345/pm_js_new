export class LoanAgreement {
  constructor(
    public readonly nomorKontrak: string,
    public readonly nama: string,
    public readonly alamat: string,
    public readonly noKtp: string,
    public readonly type: string,
    public readonly pokokPinjaman: number,
    public readonly tenor: number,
    public readonly biayaAdmin: number,
    public readonly cicilan: number,
    public readonly biayaLayanan: number,
    public readonly bunga: number,
    public readonly tanggalJatuhTempo: Date,
    public readonly id?: number,
    public readonly nomorUrut?: number,
    public readonly kelompok?: string,
    public readonly perusahaan?: string,
    public readonly inisialMarketing?: string,
    public readonly golongan?: string,
    public readonly inisialCa?: string,
    public readonly idCard?: string,
    public readonly kedinasan?: string,
    public readonly pinjamanKe?: string,
    public readonly catatan?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validateFields();
  }

  private validateFields() {
    if (this.pokokPinjaman < 0) {
      throw new Error('Pokok pinjaman harus positif');
    }
    if (this.tenor <= 0) {
      throw new Error('Tenor harus lebih dari 0');
    }
    if (this.bunga < 0) {
      throw new Error('Bunga harus positif atau nol');
    }
    // Bisa ditambah validasi lain sesuai kebutuhan domain
  }

  getTotalPinjaman(): number {
    return this.pokokPinjaman + this.biayaAdmin + this.biayaLayanan + this.bunga;
  }
}
