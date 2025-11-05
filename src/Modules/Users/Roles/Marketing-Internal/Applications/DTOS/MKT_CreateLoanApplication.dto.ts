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
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';

import {
  StatusRumahEnum,
  DomisiliEnum,
} from 'src/Shared/Enums/Internal/Address.enum';

import {
  HubunganEnum,
  BekerjaEnum,
} from 'src/Shared/Enums/Internal/Family.enum';
import {
  GolonganEnum,
  PerusahaanEnum,
} from 'src/Shared/Enums/Internal/Job.enum';

import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

import { KerabatKerjaEnum } from 'src/Shared/Enums/Internal/Relative.enum';
import {
  PenjaminEnum,
  RiwayatPinjamPenjaminEnum,
} from 'src/Shared/Enums/Internal/Collateral.enum';

export class ClientInternalDto {
  @IsNotEmpty()
  @IsString()
  nama_lengkap: string;

  @IsNotEmpty()
  @IsString()
  no_ktp: string;

  @IsNotEmpty()
  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsNotEmpty()
  @IsString()
  tempat_lahir: string;

  @IsNotEmpty()
  @IsDateString()
  tanggal_lahir: string;

  @IsNotEmpty()
  @IsString()
  no_hp: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(MARRIAGE_STATUS)
  status_nikah: MARRIAGE_STATUS;

  @IsOptional()
  @IsString()
  no_rekening?: string;

  @IsOptional()
  foto_ktp?: string | Express.Multer.File;

  @IsOptional()
  foto_kk?: string | Express.Multer.File;

  @IsOptional()
  points?: string;

  @IsOptional()
  enable_edit?: boolean;

  // Hilangkan enable_edit dan points supaya validasi gak error
}
//#endregion

//#region Address
export class AddressInternalDto {
  @IsNotEmpty()
  @IsString()
  alamat_ktp: string;

  @IsNotEmpty()
  @IsString()
  rt_rw: string;

  @IsNotEmpty()
  @IsString()
  kelurahan: string;

  @IsNotEmpty()
  @IsString()
  kecamatan: string;

  @IsNotEmpty()
  @IsString()
  kota: string;

  @IsNotEmpty()
  @IsString()
  provinsi: string;

  @IsOptional()
  @IsString()
  status_rumah_ktp: string | null;

  @IsNotEmpty()
  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsNotEmpty()
  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsOptional()
  @IsString()
  alamat_lengkap?: string;
}
//#endregion

//#region Family
export class FamilyInternalDto {
  @IsNotEmpty()
  @IsEnum(HubunganEnum)
  hubungan: HubunganEnum;

  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsEnum(BekerjaEnum)
  bekerja: BekerjaEnum;

  @IsOptional()
  @IsString()
  nama_perusahaan: string;

  @IsOptional()
  @IsString()
  jabatan?: string;

  @IsOptional()
  @IsNumber()
  penghasilan: number;

  @IsOptional()
  @IsString()
  alamat_kerja: string;

  @IsNotEmpty()
  @IsString()
  no_hp: string;
}
//#endregion

//#region Job
export class JobInternalDto {
  @IsNotEmpty()
  @IsEnum(PerusahaanEnum)
  perusahaan: PerusahaanEnum;

  @IsNotEmpty()
  @IsString()
  divisi: string;

  @IsNotEmpty()
  @IsNumber()
  lama_kerja_bulan: number;

  @IsNotEmpty()
  @IsNumber()
  lama_kerja_tahun: number;

  @IsOptional()
  @IsEnum(GolonganEnum)
  golongan?: GolonganEnum;

  @IsOptional()
  @IsString()
  yayasan?: string;

  @IsOptional()
  @IsString()
  nama_atasan?: string;

  @IsOptional()
  @IsString()
  nama_hrd?: string;

  @IsOptional()
  @IsString()
  absensi?: string;

  @IsOptional()
  @IsString()
  bukti_absensi?: string;
}
//#endregion

//#region Loan
export class LoanInternalDto {
  @IsOptional()
  @IsEnum(StatusPinjamanEnum)
  status_pinjaman?: StatusPinjamanEnum;

  @IsOptional()
  @IsNumber()
  pinjaman_ke: number;

  @IsOptional()
  @IsNumber()
  nominal_pinjaman: number;

  @IsOptional()
  @IsNumber()
  tenor: number;

  @IsOptional()
  @IsString()
  keperluan: string;

  @IsOptional()
  @IsEnum(StatusPengajuanEnum)
  status: StatusPengajuanEnum;

  @IsOptional()
  @IsEnum(StatusPengajuanAkhirEnum)
  status_akhir_pengajuan: StatusPengajuanAkhirEnum;

  @IsOptional()
  @IsNumber()
  riwayat_nominal?: number;

  @IsOptional()
  @IsNumber()
  riwayat_tenor?: number;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  is_banding?: number;

  @IsOptional()
  @IsString()
  alasan_banding?: string;
}
//#endregion

//#region Relative
export class RelativeInternalDto {
  @IsOptional()
  @IsEnum(KerabatKerjaEnum)
  kerabat_kerja: KerabatKerjaEnum;

  @IsOptional()
  @IsString()
  nama: string;

  @IsOptional()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  no_hp: string;

  @IsOptional()
  @IsString()
  nama_perusahaan: string;

  @IsOptional()
  @IsString()
  status_hubungan: string;
}
//#endregion

//#region Collateral
export class CollateralInternalDto {
  @IsOptional()
  @IsString()
  jaminan_hrd: string;

  @IsOptional()
  @IsString()
  jaminan_cg: string;

  @IsOptional()
  @IsEnum(PenjaminEnum)
  penjamin: PenjaminEnum;

  @IsOptional()
  @IsString()
  nama_penjamin: string;

  @IsOptional()
  @IsString()
  lama_kerja_penjamin?: string;

  @IsOptional()
  @IsString()
  bagian?: string;

  @IsOptional()
  @IsString()
  absensi?: string;

  @IsOptional()
  @IsString()
  absensi_penjamin?: string;

  @IsOptional()
  @IsEnum(RiwayatPinjamPenjaminEnum)
  riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum;

  @IsOptional()
  @IsNumber()
  riwayat_nominal_penjamin?: number;

  @IsOptional()
  @IsNumber()
  riwayat_tenor_penjamin?: number;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman_penjamin?: number;

  @IsOptional()
  @IsString()
  jaminan_cg_penjamin?: string;

  @IsOptional()
  @IsString()
  status_hubungan_penjamin?: string;
}
//#endregion

//#region Files
export class FilesDto {
  @IsOptional()
  foto_ktp?: string | Express.Multer.File;

  @IsOptional()
  foto_kk?: string | Express.Multer.File;

  @IsOptional()
  foto_id_card?: string | Express.Multer.File;

  @IsOptional()
  bukti_absensi_file?: string | Express.Multer.File;

  @IsOptional()
  foto_ktp_penjamin?: string | Express.Multer.File;

  @IsOptional()
  foto_id_card_penjamin?: string | Express.Multer.File;

  @IsOptional()
  foto_rekening?: string | Express.Multer.File;
}
//#endregion

//#region Main DTO
export class CreateLoanApplicationDto {
  // @IsNotEmpty()
  // @IsNumber()
  // marketingId: number;

  @ValidateNested()
  @Type(() => ClientInternalDto)
  client_internal: ClientInternalDto;

  @ValidateNested()
  @Type(() => AddressInternalDto)
  address_internal: AddressInternalDto;

  @ValidateNested()
  @Type(() => FamilyInternalDto)
  family_internal: FamilyInternalDto;

  @ValidateNested()
  @Type(() => JobInternalDto)
  job_internal: JobInternalDto;

  @ValidateNested()
  @Type(() => LoanInternalDto)
  loan_application_internal: LoanInternalDto;

  @ValidateNested()
  @Type(() => CollateralInternalDto)
  collateral_internal: CollateralInternalDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => RelativeInternalDto)
  relative_internal?: RelativeInternalDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => FilesDto)
  documents_files?: FilesDto;
}
//#endregion

//#region Exported Types
export interface TypeLoanApplicationDetail {
  client_id?: number;
  // Client Info
  nama_lengkap: string;
  no_ktp: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_hp: string;
  email: string;
  status_nikah: string;
  no_rekening?: string;

  // Address
  alamat_ktp: string;
  rt_rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  status_rumah_ktp: string;
  status_rumah: string;
  domisili: string;
  alamat_lengkap?: string;

  // Family
  family_hubungan: string;
  nama_keluarga: string;
  bekerja: string;
  nama_perusahaan?: string;
  jabatan?: string;
  penghasilan?: number;
  alamat_kerja?: string;
  no_hp_keluarga?: string;

  // Job
  perusahaan: string;
  divisi: string;
  lama_kerja_bulan?: number;
  lama_kerja_tahun?: number;
  golongan?: string;
  yayasan?: string;
  nama_atasan?: string;
  nama_hrd?: string;
  absensi?: string;
  bukti_absensi?: string;

  // Loan
  status_pinjaman?: string;
  pinjaman_ke?: number;
  nominal_pinjaman?: number;
  tenor?: number;
  keperluan?: string;
  status_pengajuan: string;
  status?: string;
  riwayat_nominal?: number;
  riwayat_tenor?: number;
  sisa_pinjaman?: number;
  notes?: string;
  loan_is_banding?: number;
  loan_alasan_banding?: string;

  // Relative (Optional)
  kerabat_kerja?: string;
  nama_kerabat_kerja?: string;
  alamat_kerabat_kerja?: string;
  no_hp_kerabat_kerja?: string;
  nama_perusahaan_kerabat_kerja?: string;
  status_hubungan_kerabat_kerja?: string;

  // Collateral
  jaminan_hrd?: string;
  jaminan_cg?: string;
  penjamin?: string;
  nama_penjamin?: string;
  lama_kerja_penjamin?: string;
  bagian?: string;
  absensi_penjamin?: string;
  riwayat_pinjam_penjamin?: string;
  riwayat_nominal_penjamin?: number;
  riwayat_tenor_penjamin?: number;
  sisa_pinjaman_penjamin?: number;
  jaminan_cg_penjamin?: string;
  status_hubungan_penjamin?: string;

  // Files (Optional)
  foto_ktp?: string;
  foto_kk?: string;
  foto_id_card_penjamin?: string;
  foto_ktp_penjamin?: string;
  foto_id_card?: string;
  bukti_absensi_file?: string;
  foto_rekening?: string;

  // Approval Metadata
  approval_id: number;
  role: string;
  // status: string;
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
    keterangan: string;
    kesimpulan: string;
    created_at: string;
    updated_at: string;
  };
}
//#endregion
