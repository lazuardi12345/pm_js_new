import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';

export class LoanAgreement {
  constructor(
    public readonly nomor_kontrak: string,
    public readonly nama: string,
    public readonly alamat: string,
    public readonly no_ktp: number,
    public readonly type: string,
    public readonly pokok_pinjaman: number,
    public readonly tenor: number,
    public readonly biaya_admin: number,
    public readonly cicilan: number,
    public readonly biaya_layanan: number,
    public readonly bunga: number,
    public readonly tanggal_jatuh_tempo: Date,
    public readonly id?: number,
    public readonly nomor_urut?: number,
    public readonly perusahaan?: InternalCompanyList,
    public readonly inisial_marketing?: string,
    public readonly golongan?: string,
    public readonly inisial_ca?: string,
    public readonly id_card?: string,
    public readonly kedinasan?: string,
    public readonly pinjaman_ke?: number,
    public readonly catatan?: string,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,
    public updated_at?: Date,
  ) {
    this.validateFields();
  }

  private validateFields() {
    if (this.pokok_pinjaman < 0) {
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
    return (
      this.pokok_pinjaman + this.biaya_admin + this.biaya_layanan + this.bunga
    );
  }
}
