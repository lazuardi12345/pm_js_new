import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';

export class CreateLoanGuarantorExternalDto {
  @IsNumber()
  nasabah_id: number;

  @IsEnum(HubunganPenjaminEnum)
  hubungan_penjamin: HubunganPenjaminEnum;

  @IsString()
  @IsNotEmpty()
  nama_penjamin: string;

  @IsString()
  @IsNotEmpty()
  pekerjaan_penjamin: string;

  @IsNumber()
  penghasilan_penjamin: number;

  @IsString()
  @IsNotEmpty()
  no_hp_penjamin: string;

  @IsEnum(PersetujuanPenjaminEnum)
  persetujuan_penjamin: PersetujuanPenjaminEnum;

  @IsString()
  @IsNotEmpty()
  foto_ktp_penjamin: string;

  @IsOptional()
  @IsBoolean()
  validasi_penjamin?: boolean;
}
