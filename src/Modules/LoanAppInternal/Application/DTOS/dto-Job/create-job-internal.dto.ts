import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { GolonganEnum, PerusahaanEnum } from 'src/Shared/Enums/Internal/Job.enum';

export class CreateJobDto {
  @IsNumber()
  nasabah_id: number;

  @IsEnum(PerusahaanEnum)
  perusahaan: PerusahaanEnum;

  @IsString()
  @IsNotEmpty()
  divisi: string;

  @IsOptional()
  @IsNumber()
  lama_kerja_bulan?: number;

  @IsOptional()
  @IsNumber()
  lama_kerja_tahun?: number;

  @IsEnum(GolonganEnum)
  golongan: GolonganEnum;

  @IsOptional()
  @IsString()
  yayasan?: string;

  @IsString()
  @IsNotEmpty()
  nama_atasan: string;

  @IsString()
  @IsNotEmpty()
  nama_hrd: string;

  @IsString()
  @IsNotEmpty()
  absensi: string;

  @IsOptional()
  @IsString()
  bukti_absensi?: string;
}
