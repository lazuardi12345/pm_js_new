// Applications/DTOS/AdAR_SearchClientLoanAgreement.dto.ts

import {
  IsOptional,
  IsString,
  IsNumberString,
  MinLength,
} from 'class-validator';

export class AdAr_GetAllClientSearchDataDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Pencarian nama minimal 3 karakter' })
  nama?: string;

  @IsOptional()
  @IsNumberString()
  no_ktp?: string;

  @IsOptional()
  @IsString()
  id_card?: string;
}
