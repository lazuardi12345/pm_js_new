import {
  IsString,
  IsEnum,
  IsEmail,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsDate,
} from 'class-validator';
// highlight-start
// Impor enum dari file entity, bukan mendefinisikannya di sini
import { GENDER, MARRIAGE_STATUS } from 'src/Shared/Enums/External/Client-External.enum';

// Definisi enum lokal DIHAPUS dari sini

export class CreateClientExternalDto {
  @IsString()
  marketing_id: number;

  @IsString()
  nama_lengkap: string;

  @IsString()
  nik: string;

  @IsString()
  no_kk: string;

  // @IsEnum sekarang menggunakan enum yang diimpor
  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsString()
  tempat_lahir: string;

  @IsDateString()
  @IsDate()
  tanggal_lahir: Date;

  @IsString()
  no_hp: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  // @IsEnum sekarang menggunakan enum yang diimpor
  @IsEnum(MARRIAGE_STATUS)
  status_nikah: MARRIAGE_STATUS;

  @IsOptional()
  @IsString()
  foto_ktp?: string;

  @IsOptional()
  @IsString()
  foto_kk?: string;

  @IsOptional()
  @IsString()
  dokumen_pendukung?: string;

  @IsOptional()
  @IsBoolean()
  validasi_nasabah?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}
