import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';

export interface CreateLoanAgreementDto {
  nama: string;
  alamat: string;
  no_ktp: number;
  type: string;
  pokok_pinjaman: number;
  tenor: number;
  biaya_admin: number;
  cicilan: number;
  biaya_layanan: number;
  bunga: number;
  tanggal_jatuh_tempo: Date;
  perusahaan?: InternalCompanyList;
  inisial_marketing?: string;
  golongan?: string;
  inisial_ca?: string;
  id_card?: string;
  kedinasan?: string;
  pinjaman_ke?: number;
  catatan?: string;
}
