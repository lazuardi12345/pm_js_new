export interface General_LoanApplicationDataInterface {
  id: number; // ID Pengajuan
  nasabah_id: number; // ID Nasabah
  status_pinjaman: string; // Status pinjaman
  pinjaman_ke: number; // Ke berapa pinjaman
  nominal_pinjaman: number; // Nominal pinjaman
  tenor: number; // Tenor pinjaman
  keperluan: string; // Keperluan pengajuan
  status_pengajuan: string; // Status pengajuan
  riwayat_nominal: number; // Riwayat nominal
  riwayat_tenor: number; // Riwayat tenor
  sisa_pinjaman: number; // Sisa pinjaman
  notes: string; // Notes pengajuan
  is_banding: boolean; // Apakah ada banding
  alasan_banding: string; // Alasan banding
  pengajuan_created_at: string; // Waktu pengajuan dibuat
  pengajuan_updated_at: string; // Waktu pengajuan di-update
  status_akhir_pengajuan: string; // Status akhir pengajuan
  profile_id: number; // ID profile
  profile_nama_lengkap: string; // Nama lengkap profile
  profile_jenis_kelamin: string; // Jenis kelamin profile
  profile_no_hp: string; // Nomor HP profile
  profile_email: string; // Email profile
  profile_status_nikah: string; // Status nikah profile
  profile_foto_ktp: string; // Foto KTP profile
  profile_foto_kk: string; // Foto KK profile
  profile_foto_id_card: string; // Foto ID Card profile
  profile_foto_rekening: string; // Foto rekening profile
  profile_no_rekening: string; // Nomor rekening profile
  profile_created_at: string; // Waktu profile dibuat
  profile_updated_at: string; // Waktu profile di-update
}
