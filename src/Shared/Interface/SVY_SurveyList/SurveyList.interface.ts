export interface SurveyListItem {
  no: number;
  nama_nasabah: string;
  nominal_pinjaman: string;
  tenor: string;
  marketing: string;
  tanggal_pengajuan: string;
  pembiayaan: string;
  pengajuan_id: number;
  nasabah_id: number;
}

export interface SurveyListResult {
  data: SurveyListItem[];
  total: number;
}
