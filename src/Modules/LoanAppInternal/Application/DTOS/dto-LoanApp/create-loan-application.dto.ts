import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

export class CreateLoanApplicationInternalDto {
  @IsNumber()
  nasabah_id: number;

  @IsEnum(StatusPinjamanEnum)
  @IsOptional()
  status_pinjaman?: StatusPinjamanEnum;

  @IsOptional()
  @IsNumber()
  pinjaman_ke?: number;

  @IsNumber()
  nominal_pinjaman: number;

  @IsNumber()
  tenor: number;

  @IsString()
  @IsNotEmpty()
  keperluan: string;

  @IsEnum(StatusPengajuanEnum)
  @IsOptional()
  status?: StatusPengajuanEnum;

  @IsOptional()
  @IsNumber()
  riwayat_nominal?: number;

  @IsOptional()
  @IsNumber()
  riwayat_tenor?: number;

  @IsOptional()
  @IsNumber()
  sisa_pinjaman?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  is_banding?: boolean;

  @IsOptional()
  @IsString()
  alasan_banding?: string;
}
