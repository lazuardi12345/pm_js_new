import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import {
  PenjaminEnum,
  RiwayatPinjamPenjaminEnum,
} from 'src/Shared/Enums/Internal/Collateral.enum';
// import { from } from 'rxjs';

export class CreateCollateralDto {
  @IsNumber()
  nasabah_id: number;

  @IsString()
  @IsNotEmpty()
  jaminan_hrd: string;

  @IsString()
  @IsNotEmpty()
  jaminan_cg: string;

  @IsEnum(PenjaminEnum)
  penjamin: PenjaminEnum;

  @IsOptional()
  @IsString()
  nama_penjamin?: string;

  @IsOptional()
  @IsString()
  lama_kerja_penjamin?: string;

  @IsOptional()
  @IsString()
  bagian?: string;

  @IsOptional()
  @IsString()
  absensi?: string;

  @IsOptional()
  @IsEnum(RiwayatPinjamPenjaminEnum)
  riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum;

  @IsOptional()
  @IsNumber()
  riwayat_nominal_penjamin?: number;

  @IsOptional()
  @IsNumber()
  riwayat_tenor_penjamin?: number;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman_penjamin?: number;

  @IsOptional()
  @IsString()
  jaminan_cg_penjamin?: string;

  @IsOptional()
  @IsString()
  status_hubungan_penjamin?: string;

  @IsOptional()
  @IsString()
  foto_ktp_penjamin?: string;

  @IsOptional()
  @IsString()
  foto_id_card_penjamin?: string;
}
