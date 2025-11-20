import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import {
  JenisPembiayaanEnum,
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';

export class CreateLoanApplicationExternalDto {
  @IsNumber()
  nasabah_id: number;

  @IsEnum(JenisPembiayaanEnum)
  jenis_pembiayaan: JenisPembiayaanEnum;

  @IsNumber()
  nominal_pinjaman: number;

  @IsNumber()
  tenor: number;

  @IsString()
  @IsNotEmpty()
  berkas_jaminan: string;

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
  @IsEnum(StatusPengajuanAkhirEnum)
  status_pengajuan_akhir?: StatusPengajuanAkhirEnum;

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
  is_banding?: boolean;

  @IsOptional()
  @IsString()
  alasan_banding?: string;
}
