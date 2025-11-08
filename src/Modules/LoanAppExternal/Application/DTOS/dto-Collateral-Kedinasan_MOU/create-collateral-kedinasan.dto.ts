import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePengajuanKedinasanMOUDto {
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
  foto_form_pengajuan?: string;

  @IsOptional()
  @IsString()
  foto_surat_kuasa_pemotongan?: string;

  @IsOptional()
  @IsString()
  foto_surat_pernyataan_peminjam?: string;

  @IsOptional()
  @IsString()
  foto_sk_golongan_terbaru?: string;

  @IsOptional()
  @IsString()
  foto_keterangan_tpp?: string;

  @IsOptional()
  @IsString()
  foto_biaya_operasional?: string;

  @IsOptional()
  @IsString()
  foto_surat_kontrak?: string; //!! MASIH BINGUNG

    @IsOptional()
  @IsString()
  foto_rekomendasi_bendahara?: string;

}
