import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreatePengajuanBPJSDto {
  @IsOptional()
  @IsNumber()
  saldo_bpjs?: number;

  @IsOptional()
  @IsDateString()
  tanggal_bayar_terakhir?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  foto_bpjs?: string;

  @IsOptional()
  @IsString()
  foto_jaminan_tambahan?: string;
}
