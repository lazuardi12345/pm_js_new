import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
   IsEnum,
   IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  isNumber,
} from 'class-validator';
import { RecordWithTtl } from 'dns';
import { DomisiliEnum, StatusRumahEnum } from 'src/Shared/Enums/Internal/Address.enum';

import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';
import { PenjaminEnum, RiwayatPinjamPenjaminEnum } from 'src/Shared/Enums/Internal/Collateral.enum';
import { GolonganEnum, PerusahaanEnum } from 'src/Shared/Enums/Internal/Job.enum';
import { StatusPengajuanEnum, StatusPinjamanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';

// ================= Client =================
class ClientInternalDto {
  @IsString() @IsNotEmpty() nama_lengkap: string;
  @IsString() @IsNotEmpty() no_ktp: string;
  @IsString() @IsNotEmpty() no_hp: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsEnum(GENDER) @IsOptional() jenis_kelamin?: GENDER;
  @IsString() @IsOptional() tempat_lahir?: string;
  @Type(() => Date) @IsDate() tanggal_lahir?: Date;
  @IsEnum(MARRIAGE_STATUS) @IsOptional() status_nikah?: MARRIAGE_STATUS;
  @IsString() @IsOptional() no_rekening?: string;
  @IsBoolean() @IsOptional() enable_edit?: boolean;
  @IsString() @IsOptional() points?: string;
  
}

// ================= Address =================
class AddressInternalDto {
  @IsOptional() @IsString() alamat_ktp?: string;
  @IsOptional() @IsString() rt_rw?: string;
  @IsOptional() @IsString() kelurahan?: string;
  @IsOptional() @IsString() kecamatan?: string;
  @IsOptional() @IsString() kota?: string;
  @IsOptional() @IsString() provinsi?: string;
  @IsOptional() @IsEnum(StatusRumahEnum) status_rumah?: StatusRumahEnum;
  @IsOptional() @IsEnum(StatusRumahEnum) status_rumah_ktp?: StatusRumahEnum;
  @IsOptional() @IsEnum(DomisiliEnum) domisili?: DomisiliEnum;
  @IsOptional() @IsString() alamat_lengkap?: string;
 
}

// ================= Family =================
class FamilyInternalDto {
  @IsOptional() @IsString() hubungan?: string;
  @IsOptional() @IsString() nama?: string;
  @IsOptional() @IsString() bekerja?: string;
  @IsOptional() @IsString() no_hp?: string;
  @IsOptional() @IsString() nama_peruashaan?: string;
  @IsOptional() @IsString() jabatan?: string;
  @IsOptional() @IsNumber() penghasilan?: number;
  @IsOptional() @IsString() alamat_kerja?: string;

}

// ================= Job =================
class JobInternalDto {
  @IsOptional() @IsEnum(PerusahaanEnum) perusahaan?: PerusahaanEnum;
  @IsOptional() @IsString() divisi?: string;
  @IsOptional() @IsNumber() lama_kerja_tahun?: number;
  @IsOptional() @IsNumber() lama_kerja_bulan?: number;
  @IsOptional() @IsEnum(GolonganEnum) golongan?: GolonganEnum;
  @IsOptional() @IsString() yayasan?: string;
  @IsOptional() @IsString() nama_atasan?: string;
  @IsOptional() @IsString() nama_hrd?: string;
  @IsOptional() @IsString() absensi?: string;
  @IsOptional() @IsString() bukti_absensi?: string;
}

// ================= Loan Application =================
class LoanApplicationInternalDto {
  @IsOptional() @IsEnum(StatusPinjamanEnum) status_pinjaman?: StatusPinjamanEnum;
  @IsOptional() @IsNumber() pinjaman_ke?: number;
  @IsOptional() @IsNumber() nominal_pinjaman?: number;
  @IsOptional() @IsNumber() tenor?: number;
  @IsOptional() @IsString() keperluan?: string;
  @IsOptional() @IsEnum(StatusPengajuanEnum) status?: StatusPengajuanEnum;
  @IsOptional() @IsNumber() riwayat_nominal?: number;
  @IsOptional() @IsNumber() riwayat_tenor?: number;
  @IsOptional() @IsNumber() sisa_pinjaman?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsBoolean() is_banding?: boolean;
  @IsOptional() @IsString() alasan_banding?: string;
}

// ================= Collateral =================
class CollateralInternalDto {
  @IsOptional() @IsString() jaminan_hrd?: string;
  @IsOptional() @IsString() jaminan_cg?: string;
  @IsOptional() @IsEnum(PenjaminEnum) penjamin?: PenjaminEnum;
  @IsOptional() @IsString() nama_penjamin?: string
  @IsOptional() @IsString() lama_kerja_penjamin?: string;
  @IsOptional() @IsString() bagian?: string;
  @IsOptional() @IsString() absensi?: string;
  @IsOptional() @IsEnum(RiwayatPinjamPenjaminEnum) riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum;
  @IsOptional() @IsNumber() riwayat_nominal_penjamin? : number;
  @IsOptional() @IsNumber() riwayat_tenor_penjamin?: number;
  @IsOptional() @IsNumber() sisa_pinjaman_penjamin?: number;
  @IsOptional() @IsString() jaminan_cg_penjamin?: string;
  @IsOptional() @IsString() status_hubungan_penjamin?: string;
  @IsOptional() @IsString() foto_ktp_penjamin?: string;
  @IsOptional() @IsString() foto_id_card_penjamin?: string;

}

// ================= Relative =================
class RelativeInternalDto {
  @IsOptional() @IsString() kerabat_kerja?: string;
  @IsOptional() @IsString() nama?: string;
  @IsOptional() @IsString() alamat?: string;
  @IsOptional() @IsString() no_hp?: string;
  @IsOptional() @IsString() status_hubungan?: string;
  @IsOptional() @IsString() nama_perusahaan?: string;
}

// ================= Uploaded Files =================
class UploadedFilesDto {
  @IsOptional() @IsString() foto_ktp?: string;
  @IsOptional() @IsString() foto_kk?: string;
  @IsOptional() @IsString() foto_id_card?: string;
  @IsOptional() @IsString() foto_rekening?: string;
}

export class PayloadDTO {
  @ValidateNested()
  @Type(() => ClientInternalDto)
  client_internal: ClientInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInternalDto)
  address_internal?: AddressInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FamilyInternalDto)
  family_internal?: FamilyInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => JobInternalDto)
  job_internal?: JobInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoanApplicationInternalDto)
  loan_application_internal?: LoanApplicationInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollateralInternalDto)
  collateral_internal?: CollateralInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RelativeInternalDto)
  relative_internal?: RelativeInternalDto;
  marketing_id: number;
}

export class CreateDraftLoanApplicationDto {
  @ValidateNested()
  @Type(() => PayloadDTO)
  payload: PayloadDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadedFilesDto)
  uploaded_files?: UploadedFilesDto;


  
}
