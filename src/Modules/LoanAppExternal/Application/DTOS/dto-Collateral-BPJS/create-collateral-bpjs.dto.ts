import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePengajuanBPJSDto {
  @IsNumber()
  pengajuan_id: number;  // harus diisi saat create

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
