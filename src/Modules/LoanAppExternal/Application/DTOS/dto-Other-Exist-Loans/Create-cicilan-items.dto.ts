import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class CicilanItemDto {
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
}
