import {
  IsEnum,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class CreateOtherExistLoansExternalDto {
  @IsNumber()
  nasabah_id: number;

  @IsEnum(CicilanLainEnum)
  cicilan_lain: CicilanLainEnum;

  @IsString()
  @IsNotEmpty()
  nama_pembiayaan: string;

  @IsOptional()
  @IsString()
  total_pinjaman?: string;

  @IsNumber()
  cicilan_perbulan: number;

  @IsNumber()
  sisa_tenor: number;

  @IsOptional()
  @IsBoolean()
  validasi_pinjaman_lain?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}
