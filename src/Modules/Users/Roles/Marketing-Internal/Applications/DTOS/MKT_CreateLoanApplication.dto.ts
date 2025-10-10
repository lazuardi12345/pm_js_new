export class CreateLoanApplicationDto {
  marketingId: number;

  //* Client Internals DTO
  nama_lengkap: string;
  no_ktp: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_hp: string;
  email: string;
  status_nikah: string;
  no_rekening: string;

  alamat_ktp: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  status_rumah_ktp: string;
  status_rumah: string;
  domisili: string;
  alamat_lengkap: string;

  hubungan: string;
  nama_keluarga: string;
  bekerja: string;
  nama_perusahaan: string;
  jabatan: string;
  penghasilan: string;
  alamat_kerja: string;
  no_hp_keluarga: string;

  perusahaan: string;
  divisi: string;
  lama_kerja_bulan: number;
  lama_kerja_tahun: number;
  golongan: string;
  yayasan: string;
  nama_atasan: string;
  nama_hrd: string;
  absensi: string;
  bukti_absensi: string; //!

  status_pinjaman: string;
  pinjaman_ke: number;
  nominal_pinjaman: number;
  tenor: number;
  keperluan: string;
  riwayat_nominal: number;
  riwayat_tenor: number;
  sisa_pinjaman: number;
  notes: string;

  kerabat_kerja: string;
  nama_kerabat_kerja: string;
  alamat_kerabat_kerja: string;
  no_hp_kerabat_kerja: string;
  hubungan_kerabat_kerja: string;
  nama_perusahaan_kerabat_kerja: string;

  jaminan_hrd: string;
  jaminan_cg: string;
  penjamin: string;
  nama_penjamin: string;
  lama_kerja_penjamin: string;
  bagian: string;
  absensi_penjamin: string;
  riwayat_pinjam_penjamin: string;
  riwayat_nominal_penjamin: number;
  riwayat_tenor_penjamin: number;
  sisa_pinjaman_penjamin: number;
  jaminan_cg_penjamin: string;
  status_hubungan_penjamin: string;
  files?: {
    foto_ktp?: Express.Multer.File[];
    foto_kk?: Express.Multer.File[];
    foto_id_card_penjamin?: Express.Multer.File[];
    foto_ktp_penjamin?: Express.Multer.File[];
    foto_id_card?: Express.Multer.File[];
    bukti_absensi?: Express.Multer.File[];
    foto_rekening?: Express.Multer.File[];
  };
}

export interface TypeLoanApplicationDetail {
  client_id: number;

  // Client Internals
  nama_lengkap: string;
  no_ktp: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_hp: string;
  email: string;
  status_nikah: string;
  no_rekening: string | null;

  alamat_ktp: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  status_rumah_ktp: string;
  status_rumah: string;
  domisili: string;
  alamat_lengkap: string;

  // Family Internals
  family_hubungan: string;
  nama_keluarga: string;
  bekerja: string;
  nama_perusahaan: string;
  jabatan: string;
  penghasilan: string;
  alamat_kerja: string;
  no_hp_keluarga: string;

  // Job Internals
  perusahaan: string;
  divisi: string;
  lama_kerja_bulan: number;
  lama_kerja_tahun: number;
  golongan: string;
  yayasan: string;
  nama_atasan: string;
  nama_hrd: string;
  absensi: string;
  bukti_absensi: string;

  // Loan Internals
  status_pinjaman: string;
  pinjaman_ke: number;
  nominal_pinjaman: number;
  tenor: number;
  keperluan: string;
  riwayat_nominal: number;
  riwayat_tenor: number;
  sisa_pinjaman: number;
  notes: string;

  // Kerabat Internals
  kerabat_kerja: string;
  nama_kerabat_kerja: string;
  alamat_kerabat_kerja: string;
  no_hp_kerabat_kerja: string;
  nama_perusahaan_kerabat_kerja: string;
  status_hubungan_kerabat_kerja: string

  // Penjamin Internals
  jaminan_hrd: string;
  jaminan_cg: string;
  penjamin: string;
  nama_penjamin: string;
  lama_kerja_penjamin: string;
  bagian: string;
  absensi_penjamin: string;
  riwayat_pinjam_penjamin: string;
  riwayat_nominal_penjamin: number;
  riwayat_tenor_penjamin: number;
  sisa_pinjaman_penjamin: number;
  jaminan_cg_penjamin: string;
  status_hubungan_penjamin: string;

  // Files
  foto_ktp: string | null;
  foto_kk: string | null;
  foto_id_card_penjamin: string | null;
  foto_ktp_penjamin: string | null;
  foto_id_card: string | null;
  bukti_absensi_file: string | null;
  foto_rekening: string | null;

  // Approval / Status
  approval_id: number;
  role: string;
  status: string;
  keterangan: string | null;
  kesimpulan: string | null;
  is_banding: number | null;
  alasan_banding: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_nama: string;
}

export interface TypeApprovalDetail {
  approval_id: number;
  role: string;
  status: string;
  is_banding: number | null;
  keterangan: string | null;
  kesimpulan: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_nama: string;
}

export interface TypeStatusApproval {
  id_user: number;
  name: string;
  data: {
    id_approval: number;
    status: string;
    keterangan: string | null;
    kesimpulan: string | null;
    created_at: string;
    updated_at: string;
  };
}
