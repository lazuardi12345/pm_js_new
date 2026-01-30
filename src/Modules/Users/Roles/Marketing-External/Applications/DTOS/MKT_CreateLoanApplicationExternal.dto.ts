import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsPositive,
  IsDate,
  IsBoolean,
  isString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';

import {
  StatusRumahEnum,
  DomisiliEnum,
} from 'src/Shared/Enums/External/Address.enum';

import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  JenisPembiayaanEnum,
  LoanType,
} from 'src/Shared/Enums/External/Loan-Application.enum';

import { RumahDomisiliEnum } from 'src/Shared/Enums/External/Address.enum';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';
import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class ClientExternalDto {
  // @Type(() => Number)
  // @IsNumber()
  // marketing_id: number;

  @IsString()
  nama_lengkap: string;

  @IsString()
  nik: string;

  @IsString()
  no_kk: string;

  @IsString()
  tempat_lahir: string;

  @Type(() => Date)
  @IsDate()
  tanggal_lahir: Date;

  @IsString()
  no_hp: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(MARRIAGE_STATUS)
  status_nikah: MARRIAGE_STATUS;

  @IsOptional()
  @IsNumber()
  points?: number;

  // @IsString()
  // nama_lengkap: string;

  @IsString()
  no_rek: string;

  @IsOptional()
  @IsString()
  foto_rekening?: string;

  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  // @IsString()
  // no_hp: string;

  // @IsEmail()
  // @IsOptional()
  // email?: string;

  // @IsEnum(MARRIAGE_STATUS)
  // status_nikah: MARRIAGE_STATUS;

  @IsOptional()
  @IsString()
  foto_ktp_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_ktp_penjamin?: string;

  @IsOptional()
  @IsString()
  foto_kk_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_kk_penjamin?: string;

  @IsOptional()
  @IsString()
  dokumen_pendukung?: string;

  @IsOptional()
  @IsBoolean()
  validasi_nasabah?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsEnum(CLIENT_TYPE)
  tipe_nasabah?: string;
}

// export class ClientExternalProfileDto {
//   @IsString()
//   nama_lengkap: string;

//   @IsString()
//   no_rek: string;

//   @IsOptional()
//   @IsString()
//   foto_rekening?: string;

//   @IsEnum(GENDER)
//   jenis_kelamin: GENDER;

//   @IsString()
//   no_hp: string;

//   @IsEmail()
//   @IsOptional()
//   email?: string;

//   @IsEnum(MARRIAGE_STATUS)
//   status_nikah: MARRIAGE_STATUS;

//   @IsOptional()
//   @IsString()
//   foto_ktp_peminjam?: string;

//   @IsOptional()
//   @IsString()
//   foto_ktp_penjamin?: string;

//   @IsOptional()
//   @IsString()
//   foto_kk_peminjam?: string;

//   @IsOptional()
//   @IsString()
//   foto_kk_penjamin?: string;

//   @IsOptional()
//   @IsString()
//   dokumen_pendukung?: string;

//   @IsOptional()
//   @IsBoolean()
//   validasi_nasabah?: boolean;

//   @IsOptional()
//   @IsString()
//   catatan?: string;
// }
//#endregion

//#region Address
export class AddressExternalDto {
  @IsString()
  @IsNotEmpty()
  alamat_ktp: string;

  @IsString()
  @IsNotEmpty()
  rt_rw: string;

  @IsString()
  @IsNotEmpty()
  kelurahan: string;

  @IsString()
  @IsNotEmpty()
  kecamatan: string;

  @IsString()
  @IsNotEmpty()
  kota: string;

  @IsString()
  @IsNotEmpty()
  provinsi: string;

  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun?: number;

  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsOptional()
  @IsString()
  alamat_domisili?: string;

  @IsEnum(RumahDomisiliEnum)
  rumah_domisili: RumahDomisiliEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan_domisili?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun_domisili?: number;

  @IsOptional()
  @IsString()
  lama_tinggal?: string;

  @IsString()
  @IsNotEmpty()
  atas_nama_listrik: string;

  @IsString()
  @IsNotEmpty()
  hubungan: string;

  @IsOptional()
  @IsString()
  foto_meteran_listrik?: string;

  @IsNotEmpty()
  @IsString()
  share_loc_domisili?: string;

  @IsOptional()
  @IsString()
  share_loc_usaha?: string;

  @IsOptional()
  @IsString()
  share_loc_tempat_kerja?: string;

  @IsOptional()
  @IsBoolean()
  validasi_alamat?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}
//#endregion

//#region Family
// export class FamilyInternalDto {
//   @IsNotEmpty()
//   @IsEnum(HubunganEnum)
//   hubungan: HubunganEnum;

//   @IsNotEmpty()
//   @IsString()
//   nama: string;

//   @IsNotEmpty()
//   @IsEnum(BekerjaEnum)
//   bekerja: BekerjaEnum;

//   @IsOptional()
//   @IsString()
//   nama_perusahaan: string;

//   @IsOptional()
//   @IsString()
//   jabatan?: string;

//   @IsOptional()
//   @IsNumber()
//   penghasilan: number;

//   @IsOptional()
//   @IsString()
//   alamat_kerja: string;

//   @IsNotEmpty()
//   @IsString()
//   no_hp: string;
// }
//#endregion

//#region Job
export class JobExternalDto {
  @IsString()
  @IsNotEmpty()
  perusahaan: string;

  @IsString()
  @IsNotEmpty()
  alamat_perusahaan: string;

  @IsString()
  @IsNotEmpty()
  kontak_perusahaan: string;

  @IsString()
  @IsNotEmpty()
  jabatan: string;

  @IsString()
  @IsNotEmpty()
  lama_kerja: string;

  @IsEnum(StatusKaryawanEnum)
  status_karyawan: StatusKaryawanEnum;

  @IsOptional()
  @IsString()
  lama_kontrak?: string;

  @IsNumber()
  @IsOptional()
  pendapatan_perbulan: number;

  @IsString()
  @IsOptional()
  slip_gaji_peminjam: string;

  @IsString()
  @IsOptional()
  slip_gaji_penjamin: string;

  @IsString()
  @IsOptional()
  foto_id_card_peminjam: string;

  @IsString()
  @IsOptional()
  foto_id_card_penjamin: string;

  @IsString()
  @IsOptional()
  rekening_koran: string;

  @IsOptional()
  @IsBoolean()
  validasi_pekerjaan?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}
//#endregion

//#region Loan
export class LoanApplicationExternalDto {
  @IsEnum(JenisPembiayaanEnum)
  jenis_pembiayaan: JenisPembiayaanEnum;

  @IsNumber()
  nominal_pinjaman: number;

  @IsNumber()
  tenor: number;

  @IsOptional()
  @IsString()
  berkas_jaminan?: string;

  @IsEnum(StatusPinjamanEnum)
  @IsOptional()
  status_pinjaman?: StatusPinjamanEnum;

  @IsOptional()
  @IsNumber()
  pinjaman_ke?: number;

  @IsOptional()
  @IsNumber()
  pinjaman_terakhir?: number;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman?: number;

  @IsOptional()
  @IsString()
  realisasi_pinjaman?: string;

  @IsOptional()
  @IsNumber()
  cicilan_perbulan?: number;

  @IsOptional()
  @IsEnum(StatusPengajuanEnum)
  status_pengajuan?: StatusPengajuanEnum;

  @IsOptional()
  @IsBoolean()
  validasi_pengajuan?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsString()
  catatan_spv?: string;

  @IsOptional()
  @IsString()
  catatan_marketing?: string;

  @IsOptional()
  @IsBoolean()
  is_banding?: boolean | number;

  @IsOptional()
  @IsString()
  alasan_banding?: string;

  @IsOptional()
  @IsDate()
  survey_schedule?: Date;

  @IsOptional()
  @IsString()
  draft_id?: string;
}
//#endregion

//#region Relative
// export class RelativeInternalDto {
//   @IsOptional()
//   @IsEnum(KerabatKerjaEnum)
//   kerabat_kerja: KerabatKerjaEnum;

//   @IsOptional()
//   @IsString()
//   nama: string;

//   @IsOptional()
//   @IsString()
//   alamat: string;

//   @IsOptional()
//   @IsString()
//   no_hp: string;

//   @IsOptional()
//   @IsString()
//   nama_perusahaan: string;

//   @IsOptional()
//   @IsString()
//   status_hubungan: string;
// }
//#endregion

//#region Collateral
// export class CollateralInternalDto {
//   @IsOptional()
//   @IsString()
//   jaminan_hrd: string;

//   @IsOptional()
//   @IsString()
//   jaminan_cg: string;

//   @IsOptional()
//   @IsEnum(PenjaminEnum)
//   penjamin: PenjaminEnum;

//   @IsOptional()
//   @IsString()
//   nama_penjamin: string;

//   @IsOptional()
//   @IsString()
//   lama_kerja_penjamin?: string;

//   @IsOptional()
//   @IsString()
//   bagian?: string;

//   @IsOptional()
//   @IsString()
//   absensi?: string;

//   @IsOptional()
//   @IsString()
//   absensi_penjamin?: string;

//   @IsOptional()
//   @IsEnum(RiwayatPinjamPenjaminEnum)
//   riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum;

//   @IsOptional()
//   @IsNumber()
//   riwayat_nominal_penjamin?: number;

//   @IsOptional()
//   @IsNumber()
//   riwayat_tenor_penjamin?: number;

//   @IsOptional()
//   @IsNumber()
//   sisa_pinjaman_penjamin?: number;

//   @IsOptional()
//   @IsString()
//   jaminan_cg_penjamin?: string;

//   @IsOptional()
//   @IsString()
//   status_hubungan_penjamin?: string;
// }

export class PengajuanBPJSDto {
  // @IsNumber()
  // pengajuan_id: number;

  @IsOptional()
  @IsNumber()
  saldo_bpjs?: number;

  @IsOptional()
  @IsDateString()
  tanggal_bayar_terakhir?: Date;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  foto_bpjs?: string;

  @IsOptional()
  @IsString()
  dokumen_pendukung_bpjs?: string;
}

export class PengajuanBPKBDto {
  // @IsNumber()
  // pengajuan_id: number;

  @IsOptional()
  @IsString()
  atas_nama_bpkb?: string;

  @IsOptional()
  @IsString()
  no_stnk?: string;

  @IsOptional()
  @IsString()
  alamat_pemilik_bpkb?: string;

  @IsOptional()
  @IsString()
  type_kendaraan?: string;

  @IsOptional()
  @IsString()
  tahun_perakitan?: string;

  @IsOptional()
  @IsString()
  warna_kendaraan?: string;

  @IsOptional()
  @IsString()
  stransmisi?: string;

  @IsOptional()
  @IsString()
  no_rangka?: string;

  @IsOptional()
  @IsString()
  foto_no_rangka?: string;

  @IsOptional()
  @IsString()
  no_mesin?: string;

  @IsOptional()
  @IsString()
  foto_no_mesin?: string;

  @IsOptional()
  @IsString()
  foto_faktur_kendaraan?: string;

  @IsOptional()
  @IsString()
  foto_snikb?: string;

  @IsOptional()
  @IsString()
  no_bpkb?: string;

  @IsOptional()
  @IsString()
  dokumen_bpkb?: string; //pdf

  @IsOptional()
  @IsString()
  foto_stnk_depan?: string;

  @IsOptional()
  @IsString()
  foto_stnk_belakang?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_depan?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_belakang?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_samping_kanan?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_samping_kiri?: string;

  @IsOptional()
  @IsString()
  foto_sambara?: string;

  @IsOptional()
  @IsString()
  foto_kwitansi_jual_beli?: string;

  @IsOptional()
  @IsString()
  foto_ktp_tangan_pertama?: string;
}

export class PengajuanKedinasan_MOU_Dto {
  // @IsNumber()
  // pengajuan_id: number;

  @IsOptional()
  @IsString()
  instansi?: string;

  @IsOptional()
  @IsString()
  surat_permohonan_kredit?: string;

  @IsOptional()
  @IsString()
  surat_pernyataan_penjamin?: string;

  @IsOptional()
  @IsString()
  surat_persetujuan_pimpinan?: string;

  @IsOptional()
  @IsString()
  surat_keterangan_gaji?: string;

  @IsOptional()
  @IsString()
  foto_form_pengajuan?: string;

  @IsOptional()
  @IsString()
  foto_surat_kuasa_pemotongan?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_sk_golongan_terbaru?: string;

  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;

  @IsOptional()
  @IsString()
  foto_surat_kontrak?: string; //!! MASIH BINGUNG

  @IsOptional()
  @IsString()
  foto_rekomendasi_bendahara?: string;
}

export class PengajuanKedinasan_Non_MOU_Dto {
  // @IsNumber()
  // pengajuan_id: number;

  @IsOptional()
  @IsString()
  instansi?: string;

  @IsOptional()
  @IsString()
  surat_permohonan_kredit?: string;

  @IsOptional()
  @IsString()
  surat_pernyataan_penjamin?: string;

  @IsOptional()
  @IsString()
  surat_persetujuan_pimpinan?: string;

  @IsOptional()
  @IsString()
  surat_keterangan_gaji?: string;

  @IsOptional()
  @IsString()
  foto_surat_kontrak?: string;

  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;
}

export class PengajuanSHMDto {
  // @IsNumber()
  // pengajuan_id: number;

  @IsOptional()
  @IsString()
  atas_nama_shm?: string;

  @IsOptional()
  @IsString()
  hubungan_shm?: string;

  @IsOptional()
  @IsString()
  alamat_shm?: string;

  @IsOptional()
  @IsString()
  luas_shm?: string;

  @IsOptional()
  @IsString()
  njop_shm?: string;

  @IsOptional()
  @IsString()
  foto_shm?: string;

  @IsOptional()
  @IsString()
  foto_kk_pemilik_shm?: string;

  @IsOptional()
  @IsString()
  foto_pbb?: string;

  @IsOptional()
  @IsString()
  foto_objek_jaminan?: string; //array

  @IsOptional()
  @IsString()
  foto_buku_nikah_suami_istri?: string;

  @IsOptional()
  @IsString()
  foto_npwp?: string;

  @IsOptional()
  @IsString()
  foto_imb?: string;

  @IsOptional()
  @IsString()
  foto_surat_ahli_waris?: string;

  @IsOptional()
  @IsString()
  foto_surat_akte_kematian?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_kepemilikan_tanah?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_tidak_dalam_sengketa?: string;
}

export class PengajuanUmkmDto {
  // @IsNumber()
  // pengajuan_id: number;

  @IsOptional()
  @IsString()
  foto_sku?: string;

  @IsOptional()
  @IsString()
  foto_usaha?: string[]; //!! AARAYYYY MASSSS

  @IsOptional()
  @IsString()
  foto_pembukuan?: string;
}

export class EmergencyContactExternalDto {
  @IsString()
  @IsNotEmpty()
  nama_kontak_darurat: string;

  @IsString()
  @IsNotEmpty()
  hubungan_kontak_darurat: string;

  @IsString()
  @IsNotEmpty()
  no_hp_kontak_darurat: string;

  @IsOptional()
  @IsBoolean()
  validasi_kontak_darurat?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

export class FinancialDependentsDto {
  @IsOptional()
  @IsString()
  kondisi_tanggungan?: string;

  @IsOptional()
  @IsBoolean()
  validasi_tanggungan?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

export class LoanGuarantorExternalDto {
  @IsEnum(HubunganPenjaminEnum)
  hubungan_penjamin: HubunganPenjaminEnum;

  @IsString()
  @IsNotEmpty()
  nama_penjamin: string;

  @IsString()
  @IsNotEmpty()
  pekerjaan_penjamin: string;

  @IsNumber()
  penghasilan_penjamin: number;

  @IsString()
  @IsNotEmpty()
  no_hp_penjamin: string;

  @IsEnum(PersetujuanPenjaminEnum)
  persetujuan_penjamin: PersetujuanPenjaminEnum;

  @IsString()
  @IsNotEmpty()
  foto_ktp_penjamin?: string;

  @IsOptional()
  @IsBoolean()
  validasi_penjamin?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

export class InstallmentItemsDto {
  @IsString()
  @IsNotEmpty()
  nama_pembiayaan: string;

  @IsOptional()
  @IsString()
  total_pinjaman?: string;

  @IsNumber()
  cicilan_perbulan: number;

  @IsNumber()
  sisa_tenor: number;
}

export class OtherExistLoansExternalDto {
  @IsEnum(CicilanLainEnum)
  cicilan_lain: CicilanLainEnum;

  @ValidateNested({ each: true })
  @Type(() => InstallmentItemsDto)
  @IsArray()
  cicilan: InstallmentItemsDto[];

  @IsOptional()
  @IsBoolean()
  validasi_pinjaman_lain?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}

// export class SurveyPhotosDto {
//   @IsNumber()
//   hasil_survey_id: number;

//   @IsOptional()
//   @IsString()
//   foto_survey?: string;
// }

// export class SurveyReportsDto {
//   @IsNumber()
//   @IsNotEmpty()
//   pengajuan_luar_id: number; // <- wajib

//   @IsString()
//   @IsNotEmpty()
//   berjumpa_siapa: string;

//   @IsString()
//   @IsNotEmpty()
//   hubungan: string;

//   @IsString()
//   @IsNotEmpty()
//   status_rumah: string;

//   @IsString()
//   @IsNotEmpty()
//   hasil_cekling1: string;

//   @IsString()
//   @IsNotEmpty()
//   hasil_cekling2: string;

//   @IsString()
//   @IsNotEmpty()
//   kesimpulan: string;

//   @IsString()
//   @IsNotEmpty()
//   rekomendasi: string;
// }

//#endregion

//#region Files
export class FilesDto {
  @IsOptional()
  foto_rekening?: string | Express.Multer.File;
  @IsOptional()
  foto_ktp_peminjam?: string | Express.Multer.File;
  @IsOptional()
  foto_ktp_penjamin?: string | Express.Multer.File;
  @IsOptional()
  foto_kk_peminjam?: string | Express.Multer.File;
  @IsOptional()
  foto_kk_penjamin?: string | Express.Multer.File;
  @IsOptional()
  dokumen_pendukung?: string | Express.Multer.File;
  @IsOptional()
  foto_meteran_listrik?: string | Express.Multer.File;
  @IsOptional()
  slip_gaji_peminjam?: string | Express.Multer.File;
  @IsOptional()
  slip_gaji_penjamin?: string | Express.Multer.File;
  @IsOptional()
  foto_id_card_peminjam?: string | Express.Multer.File;
  @IsOptional()
  foto_id_card_penjamin?: string | Express.Multer.File;
  @IsOptional()
  rekening_koran?: string | Express.Multer.File;
  @IsOptional()
  berkas_jaminan?: string | Express.Multer.File;
  @IsOptional()
  foto_bpjs?: string | Express.Multer.File;
  @IsOptional()
  dokumen_pendukung_bpjs?: string | Express.Multer.File;
  @IsOptional()
  jaminan_tambahan?: string | Express.Multer.File;
  @IsOptional()
  foto_no_rangka?: string | Express.Multer.File;
  @IsOptional()
  foto_no_mesin?: string | Express.Multer.File;
  @IsOptional()
  foto_faktur_kendaraan?: string | Express.Multer.File;
  @IsOptional()
  foto_snikb?: string | Express.Multer.File;
  @IsOptional()
  dokumen_bpkb?: string | Express.Multer.File;
  @IsOptional()
  foto_stnk_depan?: string | Express.Multer.File;
  @IsOptional()
  foto_stnk_belakang?: string | Express.Multer.File;
  @IsOptional()
  foto_kendaraan_depan?: string | Express.Multer.File;
  @IsOptional()
  foto_kendaraan_belakang?: string | Express.Multer.File;
  @IsOptional()
  foto_kendaraan_samping_kanan?: string | Express.Multer.File;
  @IsOptional()
  foto_kendaraan_samping_kiri?: string | Express.Multer.File;
  @IsOptional()
  foto_sambara?: string | Express.Multer.File;
  @IsOptional()
  foto_kwitansi_jual_beli?: string | Express.Multer.File;
  @IsOptional()
  foto_ktp_tangan_pertama?: string | Express.Multer.File;
  @IsOptional()
  surat_permohonan_kredit_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_pernyataan_penjamin_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_persetujuan_pimpinan_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_keterangan_gaji_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_form_pengajuan_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_kuasa_pemotongan_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_pernyataan_peminjam_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_sk_golongan_terbaru_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_keterangan_tpp_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_biaya_operasional_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_kontrak_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_rekomendasi_bendahara_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_permohonan_kredit_non_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_pernyataan_penjamin_non_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_persetujuan_pimpinan_non_mou?: string | Express.Multer.File;
  @IsOptional()
  surat_keterangan_gaji_non_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_kontrak_non_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_keterangan_tpp_non_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_biaya_operasional_non_mou?: string | Express.Multer.File;
  @IsOptional()
  foto_shm?: string | Express.Multer.File;
  @IsOptional()
  foto_kk_pemilik_shm?: string | Express.Multer.File;
  @IsOptional()
  foto_pbb?: string | Express.Multer.File;
  @IsOptional()
  foto_objek_jaminan?: string | Express.Multer.File;
  @IsOptional()
  foto_buku_nikah_suami_istri?: string | Express.Multer.File;
  @IsOptional()
  foto_npwp?: string | Express.Multer.File;
  @IsOptional()
  foto_imb?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_ahli_waris?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_akte_kematian?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_pernyataan_kepemilikan_tanah?: string | Express.Multer.File;
  @IsOptional()
  foto_surat_pernyataan_tidak_dalam_sengketa?: string | Express.Multer.File;
  @IsOptional()
  foto_sku?: string | Express.Multer.File;
  @IsOptional()
  foto_usaha?: string | Express.Multer.File;
  @IsOptional()
  foto_pembukuan?: string | Express.Multer.File;
}
//#endregion

//#region Main DTO
export class CreateLoanApplicationExternalDto {
  // @IsNotEmpty()
  // @IsNumber()
  // marketingId: number;

  @ValidateNested()
  @Type(() => ClientExternalDto)
  client_external: ClientExternalDto;

  // @ValidateNested()
  // @Type(() => ClientExternalProfileDto)
  // client_external_profile: ClientExternalProfileDto;

  @ValidateNested()
  @Type(() => AddressExternalDto)
  address_external: AddressExternalDto;

  @ValidateNested()
  @Type(() => JobExternalDto)
  job_external: JobExternalDto;

  @ValidateNested()
  @Type(() => LoanApplicationExternalDto)
  loan_application_external: LoanApplicationExternalDto;

  @ValidateNested()
  @Type(() => PengajuanBPJSDto)
  collateral_bpjs_external: PengajuanBPJSDto;

  @ValidateNested()
  @Type(() => PengajuanBPKBDto)
  collateral_bpkb_external: PengajuanBPKBDto;

  @ValidateNested()
  @Type(() => PengajuanKedinasan_MOU_Dto)
  collateral_kedinasan_mou_external: PengajuanKedinasan_MOU_Dto;

  @ValidateNested()
  @Type(() => PengajuanKedinasan_Non_MOU_Dto)
  collateral_kedinasan_non_mou_external: PengajuanKedinasan_Non_MOU_Dto;

  @ValidateNested()
  @Type(() => PengajuanSHMDto)
  collateral_shm_external: PengajuanSHMDto;

  @ValidateNested()
  @Type(() => PengajuanUmkmDto)
  collateral_umkm_external: PengajuanUmkmDto;

  @ValidateNested()
  @Type(() => EmergencyContactExternalDto)
  emergency_contact_external: EmergencyContactExternalDto;

  @ValidateNested()
  @Type(() => FinancialDependentsDto)
  financial_dependents_external: FinancialDependentsDto;

  @ValidateNested()
  @Type(() => LoanGuarantorExternalDto)
  loan_guarantor_external: LoanGuarantorExternalDto;

  @ValidateNested()
  @Type(() => OtherExistLoansExternalDto)
  other_exist_loan_external: OtherExistLoansExternalDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => FilesDto)
  documents_files?: FilesDto;

  @IsEnum(LoanType)
  @IsNotEmpty()
  loan_external_type: LoanType;

  @IsBoolean()
  @IsNotEmpty()
  isHaveInstallment?: LoanType;
}
//#endregion

//#region Exported Types
export interface TypeLoanApplicationDetail {
  client_id?: number;
  marketing_id: number;

  // Client Info
  nama_lengkap: string;
  no_ktp: string;
  nik: string;
  no_kk: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_hp: string;
  email: string;
  status_nikah: string;
  dokumen_pendukung?: string;
  validasi_nasabah?: string;
  catatan?: string;
  no_rekening?: string;
  tipe_nasabah?: string;

  // Address
  alamat_ktp: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  status_rumah: StatusRumahEnum;
  biaya_perbulan?: number;
  biaya_pertahun?: number;
  domisili: DomisiliEnum;
  alamat_domisili?: string;
  rumah_domisili: RumahDomisiliEnum;
  biaya_perbulan_domisili?: number;
  biaya_pertahun_domisili?: number;
  lama_tinggal?: string;
  atas_nama_listrik: string;
  hubungan: string;
  foto_meteran_listrik?: string;
  share_loc_domisili?: string;
  share_loc_usaha?: string;
  share_loc_tempat_kerja?: string;
  validasi_alamat?: boolean;
  catatan_alamat?: string;

  // Job
  nasabah_id: number;
  perusahaan: string;
  alamat_perusahaan: string;
  kontak_perusahaan: string;
  jabatan: string;
  lama_kerja: string;
  status_karyawan: StatusKaryawanEnum;
  lama_kontrak?: string;
  pendapatan_perbulan: number;
  slip_gaji_peminjam: string;
  slip_gaji_penjamin: string;
  id_card_peminjam: string;
  id_card_penjamin: string;
  rekening_koran: string;
  validasi_pekerjaan?: boolean;
  catatan_pekerjaan?: string;

  // Loan
  jenis_pembiayaan: JenisPembiayaanEnum;
  berkas_jaminan: string;
  pinjaman_terakhir?: number;
  realisasi_pinjaman?: string;
  cicilan_perbulan?: number;
  validasi_pengajuan?: boolean;
  catatan_pengajuan?: string;
  catatan_spv?: string;
  catatan_marketing?: string;
  is_banding?: boolean;
  alasan_banding?: string;
  status_pinjaman?: string;
  pinjaman_ke?: number;
  nominal_pinjaman?: number;
  tenor?: number;
  keperluan?: string;
  status_pengajuan: string;
  status?: string;
  sisa_pinjaman?: number;
  loan_is_banding?: number;
  loan_alasan_banding?: string;

  // Files (Optional) - Basic
  foto_ktp_peminjam?: string;
  foto_kk_peminjam?: string;
  foto_ktp_penjamin?: string;
  foto_kk_penjamin?: string;
  foto_id_card_penjamin?: string;
  foto_id_card?: string;
  bukti_absensi_file?: string;
  foto_rekening?: string;

  // ========== ATTACHMENT DATA - BPJS ==========
  pengajuan_bpjs?: {
    pengajuan_id?: number;
    saldo_bpjs?: number;
    tanggal_bayar_terakhir?: string;
    username?: string;
    password?: string;
    foto_bpjs?: string;
    dokumen_pendukung_bpjs?: string;
  };

  // ========== ATTACHMENT DATA - BPKB (Kendaraan) ==========
  pengajuan_bpkb?: {
    pengajuan_id?: number;
    atas_nama_bpkb?: string;
    no_stnk?: string;
    alamat_pemilik_bpkb?: string;
    type_kendaraan?: string;
    tahun_perakitan?: string;
    warna_kendaraan?: string;
    stransmisi?: string;
    no_rangka?: string;
    foto_no_rangka?: string;
    no_mesin?: string;
    foto_no_mesin?: string;
    foto_faktur_kendaraan?: string;
    foto_snikb?: string;
    no_bpkb?: string;
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
  };

  // ========== ATTACHMENT DATA - Kedinasan MOU ==========
  pengajuan_kedinasan_mou?: {
    pengajuan_id?: number;
    instansi?: string;
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
  };

  // ========== ATTACHMENT DATA - Kedinasan Non-MOU ==========
  pengajuan_kedinasan_non_mou?: {
    pengajuan_id?: number;
    instansi?: string;
    surat_permohonan_kredit?: string;
    surat_pernyataan_penjamin?: string;
    surat_persetujuan_pimpinan?: string;
    surat_keterangan_gaji?: string;
    foto_surat_kontrak?: string;
    foto_keterangan_tpp?: string;
    foto_biaya_operasional?: string;
  };

  // ========== ATTACHMENT DATA - SHM (Sertifikat Tanah) ==========
  pengajuan_shm?: {
    pengajuan_id?: number;
    atas_nama_shm?: string;
    hubungan_shm?: string;
    alamat_shm?: string;
    luas_shm?: string;
    njop_shm?: string;
    foto_shm?: string;
    foto_kk_pemilik_shm?: string;
    foto_pbb?: string;
    foto_objek_jaminan?: string;
    foto_buku_nikah_suami_istri?: string;
    foto_npwp?: string;
    foto_imb?: string;
    foto_surat_ahli_waris?: string;
    foto_surat_akte_kematian?: string;
    foto_surat_pernyataan_kepemilikan_tanah?: string;
    foto_surat_pernyataan_tidak_dalam_sengketa?: string;
  };

  // ========== ATTACHMENT DATA - UMKM ==========
  pengajuan_umkm?: {
    pengajuan_id?: number;
    foto_sku?: string;
    foto_usaha?: string[];
    foto_pembukuan?: string;
  };

  // ========== ATTACHMENT DATA - Emergency Contact ==========
  emergency_contacts: {
    nasabah_id: number;
    nama_kontak_darurat: string;
    hubungan_kontak_darurat: string;
    no_hp_kontak_darurat: string;
    validasi_kontak_darurat?: boolean;
    catatan?: string;
  };

  // ========== ATTACHMENT DATA - Financial Dependents ==========
  financial_dependents: {
    nasabah_id: number;
    kondisi_tanggungan?: string;
    validasi_tanggungan?: boolean;
    catatan_tanggungan?: string;
  };

  // ========== ATTACHMENT DATA - Loan Guarantor ==========
  loan_guarantors: {
    nasabah_id: number;
    hubungan_penjamin: string;
    nama_penjamin: string;
    pekerjaan_penjamin: string;
    penghasilan_penjamin: number;
    no_hp_penjamin: string;
    persetujuan_penjamin: string;
    foto_ktp_penjamin: string;
    validasi_penjamin?: boolean;
    catatan_penjamin?: string;
  };

  // ========== ATTACHMENT DATA - Other Existing Loans ==========
  other_loans: {
    nasabah_id: number;
    cicilan_lain: string;
    nama_pembiayaan: string;
    total_pinjaman?: string;
    cicilan_perbulan: number;
    sisa_tenor: number;
    validasi_pinjaman_lain?: boolean;
    catatan_pinjaman_lain?: string;
  };

  // ========== ATTACHMENT DATA - Survey Reports =======id_card_peminjam===
  survey_report?: {
    pengajuan_luar_id: number;
    berjumpa_siapa: string;
    hubungan: string;
    status_rumah: string;
    hasil_cekling1: string;
    hasil_cekling2: string;
    kesimpulan: string;
    rekomendasi: string;
  };

  // ========== ATTACHMENT DATA - Survey Photos ==========
  survey_photos?: Array<{
    hasil_survey_id: number;
    foto_survey?: string;
  }>;

  // Approval Metadata
  approval_id: number;
  role: string;
  keterangan: string;
  kesimpulan: string;
  created_at: string;
  updated_at: string;

  // User Info
  user_id: number;
  user_nama: string;
}

export interface TypeApprovalDetail {
  approval_id: number;
  role: string;
  status: string;
  is_banding?: number;
  keterangan: string;
  kesimpulan: string;
  tenor_persetujuan: number;
  nominal_persetujuan: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_nama: string;
}

export interface TypeStatusApproval {
  id_user: number;
  name: string;
  data: {
    id_approval: number | null;
    status: string | null;
    keterangan: string | null;
    kesimpulan: string | null;
    approved_tenor: number | null;
    approved_amount: number | null;
    created_at: string | null;
    updated_at: string | null;
  };
}
//#endregion
