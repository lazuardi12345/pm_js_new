import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';
import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';

export interface LoanInstallmentDetailForAdminReceivable {
  periode: number;
  pokok: number;
  bunga: number;
  admin: number;
  layanan: number;
  totalBayar: number;
}

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
    public readonly jenis_jaminan?: string,
    public readonly daerah?: string,
    public readonly tipe_pekerja?: string,
    public readonly sub_type?: string,
    public readonly potongan?: string,
    public readonly pay_type?: PayType,
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
  }

  // BIAYA_LAYANAN = pokok_pinjaman * 0.3% * tenor (computed dari field biaya_layanan yang sudah ada)
  get biayaLayananPerBulan(): number {
    return this.biaya_layanan / this.tenor;
  }

  // CICILAN_PER_BULAN = cicilan + biayaLayananPerBulan
  get cicilanPerBulan(): number {
    return this.cicilan + this.biayaLayananPerBulan;
  }

  // BUNGA_REAL = (cicilanPerBulan * tenor) - pokok_pinjaman
  get bungaReal(): number {
    return this.cicilanPerBulan * this.tenor - this.pokok_pinjaman;
  }

  getInstallmentDetails(): LoanInstallmentDetailForAdminReceivable[] {
    const details: LoanInstallmentDetailForAdminReceivable[] = [];

    for (let i = 1; i <= this.tenor; i++) {
      const isFirstMonth = i === 1;
      details.push({
        periode: i,
        pokok: this.pokok_pinjaman / this.tenor,
        bunga: this.bungaReal / this.tenor,
        admin: isFirstMonth ? this.biaya_admin : 0,
        layanan: this.biayaLayananPerBulan,
        totalBayar: isFirstMonth
          ? this.cicilanPerBulan + this.biaya_admin
          : this.cicilanPerBulan,
      });
    }

    return details;
  }

  getTotalPinjaman(): number {
    return (
      this.pokok_pinjaman + this.biaya_admin + this.biaya_layanan + this.bunga
    );
  }
}
