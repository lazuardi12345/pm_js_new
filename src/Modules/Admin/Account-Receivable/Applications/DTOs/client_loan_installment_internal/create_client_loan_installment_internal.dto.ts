// Application/DTOs/dto-ClientLoanInstallmentInternal/create-client-loan-installment-internal.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';

export class CreateClientLoanInstallmentInternalDto {
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsNumber()
  @IsNotEmpty()
  nik: number;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsNumber()
  @IsNotEmpty()
  original_loan_principal: number;

  @IsNumber()
  @IsNotEmpty()
  revenue_forecast: number;

  @IsNumber()
  @IsNotEmpty()
  outstanding_receivable_total: number;
}
