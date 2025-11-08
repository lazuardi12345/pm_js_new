import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePengajuanUmkmDto {
  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsString()
  foto_sku?: string;

  @IsOptional()
  @IsString()
  foto_usaha?: string; //!! AARAYYYY MASSSS 

  @IsOptional()
  @IsString()
  foto_pembukuan?: string;

}
