import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePengajuanBPKBDto {

  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsString()
  atas_nama_bpkb?: string;

  @IsOptional()
  @IsString()
  no_stnk?: string;

  @IsOptional()
  @IsString()
  alamat_pemilik_bpkb?: string;

  @IsOptional()
  @IsString()
  type_kendaraan?: string;

  @IsOptional()
  @IsString()
  tahun_perakitan?: string;

  @IsOptional()
  @IsString()
  warna_kendaraan?: string;

  @IsOptional()
  @IsString()
  stransmisi?: string;

  @IsOptional()
  @IsString()
  no_rangka?: string;

  @IsOptional()
  @IsString()
  no_mesin?: string;

  @IsOptional()
  @IsString()
  no_bpkb?: string;

  @IsOptional()
  @IsString()
  foto_stnk?: string;

  @IsOptional()
  @IsString()
  foto_bpkb?: string;

  @IsOptional()
  @IsString()
  foto_motor?: string;
}
