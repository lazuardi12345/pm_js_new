import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePengajuanSHMDto {

  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsString()
  atas_nama_shm?: string;

  @IsOptional()
  @IsString()
  hubungan_shm?: string;

  @IsOptional()
  @IsString()
  alamat_shm?: string;

  @IsOptional()
  @IsString()
  luas_shm?: string;

  @IsOptional()
  @IsString()
  njop_shm?: string;

  @IsOptional()
  @IsString()
  foto_shm?: string;

  @IsOptional()
  @IsString()
  foto_kk_pemilik_shm?: string;

  @IsOptional()
  @IsString()
  foto_pbb?: string;
}
