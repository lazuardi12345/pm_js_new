import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePengajuanBPJSDto {
  @IsNumber()
  pengajuan_id: number;

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
  foto_ktp_suami_istri?: string;

  @IsOptional()
  @IsString()
  foto_ktp_penjamin?: string;

  @IsOptional()
  @IsString()
  foto_kk_pemohon_penjamin?: string;

  @IsOptional()
  @IsString()
  foto_id_card_suami_istri?: string;

  @IsOptional()
  @IsString()
  slip_gaji?: string;

  @IsOptional()
  @IsString()
  rekening_koran?: string;


  @IsOptional()
  @IsString()
  foto_jaminan_tambahan?: string;
}
