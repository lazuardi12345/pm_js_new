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
  foto_no_rangka?: string;

  @IsOptional()
  @IsString()
  no_mesin?: string;

  @IsOptional()
  @IsString()
  foto_no_mesin?: string;

  @IsOptional()
  @IsString()
  foto_faktur_kendaraan?: string;

  @IsOptional()
  @IsString()
  foto_snikb?: string;

  @IsOptional()
  @IsString()
  no_bpkb?: string;

  
  @IsOptional()
  @IsString()
  dokumen_bpkb?: string; //pdf

  @IsOptional()
  @IsString()
  foto_stnk_depan?: string;

  @IsOptional()
  @IsString()
  foto_stnk_belakang?: string;



  @IsOptional()
  @IsString()
  foto_kendaraan_depan?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_belakang?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_samping_kanan?: string;

  @IsOptional()
  @IsString()
  foto_kendaraan_samping_kiri?: string;

  
  @IsOptional()
  @IsString()
  foto_sambara?: string; 

  
  @IsOptional()
  @IsString()
  foto_kwitansi_jual_beli?: string; 

  @IsOptional()
  @IsString()
  foto_ktp_tangan_pertama?: string; 
}
