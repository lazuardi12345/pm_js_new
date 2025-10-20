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

import { HubunganEnum, BekerjaEnum } from 'src/Shared/Enums/Internal/Family.enum';
import { GolonganEnum, PerusahaanEnum } from 'src/Shared/Enums/Internal/Job.enum';

import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
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
  no_rekening?: string | null;

  @IsOptional()
  foto_ktp?: string | Express.Multer.File | null;

  @IsOptional()
  foto_kk?: string | Express.Multer.File | null;
  
  @IsOptional()
  points: string;

  @IsOptional()
  enable_edit: boolean;


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

  @IsNotEmpty()
  @IsString()
  status_rumah_ktp: string;

  @IsNotEmpty()
  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsNotEmpty()
  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsNotEmpty()
  @IsString()
  alamat_lengkap: string;
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
  jabatan?: string | null;

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
  golongan?: GolonganEnum | null;

  @IsOptional()
  @IsString()
  yayasan?: string | null;

  @IsOptional()
  @IsString()
  nama_atasan?: string | null;

  @IsOptional()
  @IsString()
  nama_hrd?: string | null;

  @IsOptional()
  @IsString()
  absensi?: string | null;

  @IsOptional()
  @IsString()
  bukti_absensi?: string | null;
}
//#endregion

//#region Loan
export class LoanInternalDto {
  @IsNotEmpty()
  @IsEnum(StatusPinjamanEnum)
  status_pinjaman: StatusPinjamanEnum;

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
  @IsNumber()
  riwayat_nominal?: number | null;

  @IsOptional()
  @IsNumber()
  riwayat_tenor?: number | null;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman?: number | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsNumber()
  is_banding?: number | null;

  @IsOptional()
  @IsString()
  alasan_banding?: string | null;
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
  hubungan: string;
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
  lama_kerja_penjamin?: string | null;

  @IsOptional()
  @IsString()
  bagian?: string | null;

  @IsOptional()
  @IsString()
  absensi?: string;

  @IsOptional()
  @IsString()
  absensi_penjamin?: string | null;

  @IsOptional()
  @IsEnum(RiwayatPinjamPenjaminEnum)
  riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum | null;

  @IsOptional()
  @IsNumber()
  riwayat_nominal_penjamin?: number | null;

  @IsOptional()
  @IsNumber()
  riwayat_tenor_penjamin?: number | null;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman_penjamin?: number | null;

  @IsOptional()
  @IsString()
  jaminan_cg_penjamin?: string | null;

  @IsOptional()
  @IsString()
  status_hubungan_penjamin?: string | null;
}
//#endregion

//#region Files
export class FilesDto {
  @IsOptional()
  foto_ktp?: string | Express.Multer.File | null;

  @IsOptional()
  foto_kk?: string | Express.Multer.File | null;

  @IsOptional()
  foto_id_card?: string | Express.Multer.File | null;

  @IsOptional()
  bukti_absensi_file?: string | Express.Multer.File | null;

  @IsOptional()
  foto_ktp_penjamin?: string | Express.Multer.File | null;

  @IsOptional()
  foto_id_card_penjamin?: string | Express.Multer.File | null;

  @IsOptional()
  foto_rekening?: string | Express.Multer.File | null;
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
  client_id: number;

  // Client Info
  nama_lengkap: string;
  no_ktp: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_hp: string;
  email: string;
  status_nikah: string;
  no_rekening: string | null;

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
  alamat_lengkap: string;

  // Family
  family_hubungan: string;
  nama_keluarga: string;
  bekerja: string;
  nama_perusahaan: string | null;
  jabatan: string | null;
  penghasilan: number;
  alamat_kerja: string;
  no_hp_keluarga: string;

  // Job
  perusahaan: string;
  divisi: string;
  lama_kerja_bulan: number;
  lama_kerja_tahun: number;
  golongan: string | null;
  yayasan: string | null;
  nama_atasan: string | null;
  nama_hrd: string | null;
  absensi: string | null;
  bukti_absensi: string | null;

  // Loan
  status_pinjaman: string;
  pinjaman_ke: number;
  nominal_pinjaman: number;
  tenor: number;
  keperluan: string;
  status: string;
  riwayat_nominal: number | null;
  riwayat_tenor: number | null;
  sisa_pinjaman: number | null;
  notes: string | null;
  is_banding: number | null;
  alasan_banding: string | null;

  // Relative (Optional)
  kerabat_kerja: string | null;
  nama_kerabat_kerja: string | null;
  alamat_kerabat_kerja: string | null;
  no_hp_kerabat_kerja: string | null;
  nama_perusahaan_kerabat_kerja: string | null;
  status_hubungan_kerabat_kerja: string | null;

  // Collateral
  jaminan_hrd: string;
  jaminan_cg: string;
  penjamin: string;
  nama_penjamin: string;
  lama_kerja_penjamin: string | null;
  bagian: string | null;
  absensi_penjamin: string | null;
  riwayat_pinjam_penjamin: string | null;
  riwayat_nominal_penjamin: number | null;
  riwayat_tenor_penjamin: number | null;
  sisa_pinjaman_penjamin: number | null;
  jaminan_cg_penjamin: string | null;
  status_hubungan_penjamin: string | null;

  // Files (Optional)
  foto_ktp: string | null;
  foto_kk: string | null;
  foto_id_card_penjamin: string | null;
  foto_ktp_penjamin: string | null;
  foto_id_card: string | null;
  bukti_absensi_file: string | null;
  foto_rekening: string | null;

  // Approval Metadata
  approval_id: number;
  role: string;
  // status: string;
  keterangan: string | null;
  kesimpulan: string | null;
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
//#endregion
