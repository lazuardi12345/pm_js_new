export class Vouchers {
  constructor(
    public readonly nama: string,
    public readonly nik: string,
    public readonly kode_voucher: string,
    public readonly kadaluarsa: Date,
    public readonly type?: string,
    public readonly saldo?: string,
    public readonly is_claim: number = 0,
    public readonly id?: number,
    public readonly created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date | null,
  ) {
    this.validateFields();
  }

  private validateFields() {
    if (!this.nama || this.nama.trim() === '') {
      throw new Error('Nama tidak boleh kosong');
    }

    if (!this.nik || this.nik.trim() === '') {
      throw new Error('NIK tidak boleh kosong');
    }

    if (!this.kode_voucher || this.kode_voucher.trim() === '') {
      throw new Error('Kode voucher tidak boleh kosong');
    }

    if (!(this.kadaluarsa instanceof Date)) {
      throw new Error('Kadaluarsa harus berupa tanggal valid');
    }

    if (this.is_claim !== 0 && this.is_claim !== 1) {
      throw new Error('is_claim harus bernilai 0 atau 1');
    }
  }

  isExpired(): boolean {
    const today = new Date();
    return this.kadaluarsa < today;
  }

  markClaimed() {
    this.updated_at = new Date();
    (this as any).is_claim = 1;
  }
}
