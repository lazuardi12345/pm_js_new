import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePengajuanKedinasan_Non_MOU_Dto {
  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsString()
  instansi?: string;

  @IsOptional()
  @IsString()
  surat_permohonan_kredit?: string;

  @IsOptional()
  @IsString()
  surat_pernyataan_penjamin?: string;

  @IsOptional()
  @IsString()
  surat_keterangan_gaji?: string;

  @IsOptional()
  @IsString()
  foto_surat_kontrak?: string;

  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;
}
