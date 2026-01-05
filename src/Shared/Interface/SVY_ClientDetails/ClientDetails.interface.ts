// src/Modules/LoanAppExternal/Domain/Interfaces/client-detail-survey.interface.ts

export interface ClientProfileData {
  nama_lengkap: string;
  no_hp: string;
  email: string;
  nik: string;
  jenis_kelamin: 'laki-laki' | 'perempuan';
  tempat_lahir?: string;
  tanggal_lahir?: Date;
  status_nikah: 'belum menikah' | 'menikah' | 'janda/duda';
}

export interface LoanApplicationData {
  loan_app_id: number;
  nominal_pinjaman: number;
  tenor: number;
  jenis_pembiayaan: string;
  status_pengajuan: string;
  survey_schedule?: Date;
  created_at: Date;
  marketing_name: string;
  marketing_email?: string;
  marketing_phone?: string;
}

export interface AddressData {
  address_id: number;
  jenis_alamat: 'domisili' | 'tempat_kerja' | 'usaha';
  share_loc?: string;
  alamat_ktp: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos?: string;
}

export interface JobData {
  job_id: number;
  perusahaan: string;
  alamat_perusahaan: string;
  kontak_perusahaan: string;
  jabatan: string;
  lama_kerja: string;
  status_karyawan: string;
  pendapatan_perbulan: number;
  sumber_pendapatan?: string;
  bidang_usaha?: string;
}

export interface GeneralDocumentData {
  foto_ktp_peminjam: string;
  foto_kk_peminjam: string;
  dokumen_pendukung: string;
  foto_meteran_listrik: string;
  slip_gaji_peminjam?: string;
  foto_rekening_koran?: string;
  foto_id_card: string;
  foto_ktp_penjamin: string;
}

// Collateral Base
export interface CollateralBase {
  collateral_type: string;
  collateral_id: number;
  pengajuan_id: number;
}

// Collateral BPJS
export interface CollateralBPJS extends CollateralBase {
  collateral_type: 'BPJS';
  saldo_bpjs: number;
  tanggal_bayar_terakhir: Date;
  username: string;
  password: string;
  foto_bpjs?: string;
  jaminan_tambahan?: string;
}

// Collateral BPKB
export interface CollateralBPKB extends CollateralBase {
  collateral_type: 'BPKB';
  atas_nama_bpkb: string;
  no_stnk: string;
  alamat_pemilik_bpkb: string;
  type_kendaraan: string;
  tahun_perakitan: string;
  warna_kendaraan: string;
  stransmisi: string;
  no_rangka: string;
  foto_no_rangka?: string;
  no_mesin: string;
  foto_no_mesin?: string;
  foto_faktur_kendaraan?: string;
  foto_snikb?: string;
  no_bpkb: string;
  dokumen_bpkb?: string;
  foto_stnk_depan?: string;
  foto_stnk_belakang?: string;
  foto_kendaraan_depan?: string;
  foto_kendaraan_belakang?: string;
  foto_kendaraan_samping_kanan?: string;
  foto_kendaraan_samping_kiri?: string;
  foto_sambara?: string;
  foto_kwitansi_jual_beli?: string;
  foto_ktp_tangan_pertama?: string;
}

// Collateral SHM
export interface CollateralSHM extends CollateralBase {
  collateral_type: 'SHM';
  atas_nama_shm: string;
  hubungan_shm: string;
  alamat_shm: string;
  luas_shm: string;
  njop_shm: number;
  foto_shm?: string;
  foto_kk_pemilik_shm?: string;
  foto_pbb?: string;
  foto_objek_jaminan?: string;
  foto_buku_nikah_suami?: string;
  foto_buku_nikah_istri?: string;
  foto_npwp?: string;
  foto_imb?: string;
  foto_surat_ahli_waris?: string;
  foto_surat_akte_kematian?: string;
  foto_surat_pernyataan_kepemilikan_tanah?: string;
  foto_surat_pernyataan_tidak_dalam_sengketa?: string;
}

// Collateral UMKM
export interface CollateralUMKM extends CollateralBase {
  collateral_type: 'UMKM';
  foto_sku?: string;
  foto_usaha?: string; // JSON array string
  foto_pembukuan?: string;
}

// Collateral Kedinasan MOU
export interface CollateralKedinasanMOU extends CollateralBase {
  collateral_type: 'KEDINASAN_MOU';
  instansi: string;
  surat_permohonan_kredit?: string;
  surat_pernyataan_penjamin?: string;
  surat_persetujuan_pimpinan?: string;
  surat_keterangan_gaji?: string;
  foto_form_pengajuan?: string;
  foto_surat_kuasa_pemotongan?: string;
  foto_surat_pernyataan_peminjam?: string;
  foto_sk_golongan_terbaru?: string;
  foto_keterangan_tpp?: string;
  foto_biaya_operasional?: string;
  foto_surat_kontrak?: string;
  foto_rekomendasi_bendahara?: string;
}

// Collateral Kedinasan Non-MOU
export interface CollateralKedinasanNonMOU extends CollateralBase {
  collateral_type: 'KEDINASAN_NON_MOU';
  instansi: string;
  surat_permohonan_kredit?: string;
  surat_pernyataan_penjamin?: string;
  surat_persetujuan_pimpinan?: string;
  surat_keterangan_gaji?: string;
  foto_surat_kontrak?: string;
  foto_keterangan_tpp?: string;
  foto_biaya_operasional?: string;
}

// Union type untuk semua collateral
export type CollateralData =
  | CollateralBPJS
  | CollateralBPKB
  | CollateralSHM
  | CollateralUMKM
  | CollateralKedinasanMOU
  | CollateralKedinasanNonMOU;

// Main Interface - Complete Client Detail

export type CollateralDataMap = {
  [collateralType: string]: CollateralData;
};
export interface ClientDetailForSurveyData {
  client_profile: ClientProfileData;
  loan_application: LoanApplicationData;
  address_external: AddressData[];
  job_external: JobData | null;
  document_files: GeneralDocumentData;
  collateral: CollateralDataMap | null;
  // guarantors: GuarantorData[];
  // emergency_contacts: EmergencyContactData[];
}
