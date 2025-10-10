import { IsOptional, IsString } from 'class-validator';

export class CreatePengajuanKedinasanDto {
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
}
