import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { CreateDetailInstallmentItemsDto } from '../dto-Detail-Installment-Items/create-detail-installment-items.dto';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

export class CreateOtherExistLoansExternalDto {
  @IsNumber()
  loan_app_ext_id: number;

  @IsEnum(CicilanLainEnum)
  cicilan_lain: CicilanLainEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailInstallmentItemsDto)
  cicilan: CreateDetailInstallmentItemsDto[];

  @IsOptional()
  @IsBoolean()
  validasi_pinjaman_lain?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}
