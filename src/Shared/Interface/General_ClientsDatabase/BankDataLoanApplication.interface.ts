export interface LoanApplicationSummary {
  nama_nasabah: string;
  id_pengajuan: number;
  tipe_nasabah: string;
  nominal_pinjaman: number;
  tenor: number;
  golongan: string;
  status_pengajuan: string;
  approval_status: string;
  keterangan: string;
  created_at: Date; // atau Date jika ingin diubah ke objek Date
}
