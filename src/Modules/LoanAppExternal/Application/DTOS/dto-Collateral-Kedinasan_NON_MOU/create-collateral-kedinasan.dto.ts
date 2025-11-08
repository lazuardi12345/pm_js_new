import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePengajuanKedinasanDto {
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
  surat_persetujuan_pimpinan?: string;

  @IsOptional()
  @IsString()
  surat_keterangan_gaji?: string;

  @IsOptional()
  @IsString()
  foto_sk?: string;


  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;
}
