import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';

export class CreateJobExternalDto {
  @IsNumber()
  nasabah_id: number;

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
  id_card_peminjam: string;

  @IsString()
  @IsOptional()
  id_card_penjamin: string;

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
