import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsDate,
  IsEnum,
} from 'class-validator';
import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';

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

  @IsNumber()
  @IsNotEmpty()
  no_ktp: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  kelompok?: string;

  @IsOptional()
  @IsEnum(InternalCompanyList)
  perusahaan?: InternalCompanyList;

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
  @IsNumber()
  pinjaman_ke?: number;

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
