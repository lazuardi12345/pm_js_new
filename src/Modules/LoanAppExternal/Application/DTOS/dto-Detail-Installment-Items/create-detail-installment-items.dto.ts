import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateDetailInstallmentItemsDto {
  @IsNumber()
  cicilan_id: number;

  @IsString()
  @IsNotEmpty()
  nama_pembiayaan: string;

  @IsOptional()
  @IsNumber()
  total_pinjaman: number;

  @IsNumber()
  cicilan_perbulan: number;

  @IsNumber()
  sisa_tenor: number;
}
