import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateLoanAgreementDto {
  @IsString()
  @IsNotEmpty()
  nomor_kontrak: string;

  @IsOptional()
  @IsNumber()
  nomor_urut?: number;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsString()
  @IsNotEmpty()
  no_ktp: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  kelompok?: string;

  @IsOptional()
  @IsString()
  perusahaan?: string;

  @IsOptional()
  @IsString()
  inisial_marketing?: string;

  @IsOptional()
  @IsString()
  golongan?: string;

  @IsOptional()
  @IsString()
  inisial_ca?: string;

  @IsOptional()
  @IsString()
  id_card?: string;

  @IsOptional()
  @IsString()
  kedinasan?: string;

  @IsOptional()
  @IsString()
  pinjaman_ke?: string;

  @IsNumber()
  pokok_pinjaman: number;

  @IsNumber()
  tenor: number;

  @IsNumber()
  biaya_admin: number;

  @IsNumber()
  cicilan: number;

  @IsNumber()
  biaya_layanan: number;

  @IsNumber()
  bunga: number;

  @IsDate()
  tanggal_jatuh_tempo: Date;

  @IsOptional()
  @IsString()
  catatan?: string;
}
