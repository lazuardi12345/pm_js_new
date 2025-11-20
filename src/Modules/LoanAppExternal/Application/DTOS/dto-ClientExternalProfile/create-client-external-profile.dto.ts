import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsEmail,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
// highlight-start
// Impor enum dari file entity, bukan mendefinisikannya di sini
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';

export class CreateClientExternalProfileDto {
  @Type(() => Number)
  @IsNumber()
  nasabah_id;

  @Type(() => Number)
  @IsNumber()
  pengajuan_id;

  @IsString()
  nama_lengkap: string;

  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsString()
  nik: string;

  @IsString()
  no_kk: string;

  @IsString()
  no_rek: string;

  @IsString()
  foto_rekening: string;

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
  @IsBoolean()
  enable_edit?: boolean;
}
