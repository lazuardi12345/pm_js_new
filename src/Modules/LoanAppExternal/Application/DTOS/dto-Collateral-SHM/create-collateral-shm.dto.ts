import { IsOptional, IsString, IsNumber } from 'class-validator';

//!!!!!! BELUM KELARRRR CUYYYYYYYYYYYYYYYYY

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

  @IsOptional()
  @IsString()
  foto_objek_jaminan?: string; //array


  @IsOptional()
  @IsString()
  foto_buku_nikah_suami?: string;

  @IsOptional()
  @IsString()
  foto_buku_nikah_istri?: string;

   @IsOptional()
  @IsString()
  foto_npwp?: string; 

   @IsOptional()
  @IsString()
  foto_imb?: string;
  
   @IsOptional()
  @IsString()
  foto_surat_ahli_waris?: string;
  
   @IsOptional()
  @IsString()
  foto_surat_akte_kematian?: string;
  
   @IsOptional()
  @IsString()
  foto_surat_pernyataan_kepemilikan_tanah?: string;
  
   @IsOptional()
  @IsString()
  foto_surat_pernyataan_tidak_dalam_sengketa?: string;
  

}
