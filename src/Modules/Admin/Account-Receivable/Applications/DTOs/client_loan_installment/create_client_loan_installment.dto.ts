// Application/DTOs/dto-ClientLoanInstallment/create-client-loan-installment.dto.ts

import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';
import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';
import { CompanyNames } from 'src/Shared/Enums/General/General.enum';

export class InstallmentMetadataDto {
  @IsOptional()
  @IsEnum(CompanyNames)
  company_name?: string;

  @IsOptional()
  @IsEnum(PayType)
  pay_type?: string;
}

export class CreateClientLoanInstallmentDto {
  @IsUUID()
  @IsNotEmpty()
  frequency_id: string; // FK → tbl_client_installment_frequency

  @IsNumber()
  @IsNotEmpty()
  frequency_number: number;

  @IsString()
  @IsNotEmpty()
  nomor_kontrak: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount_due: number;

  @IsEnum(InstallmentStatus)
  @IsNotEmpty()
  status: InstallmentStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => InstallmentMetadataDto)
  metadata?: InstallmentMetadataDto;
}
