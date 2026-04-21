// Application/DTOs/dto-ClientInstallmentFrequency/create-client-installment-frequency.dto.ts

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';

export class CreateClientInstallmentFrequencyDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string; // FK → tbl_client_loan_installment_internal

  @IsNumber()
  @IsNotEmpty()
  loan_agreement_id: number;

  @IsNumber()
  @IsNotEmpty()
  loan_frequency: number;

  @IsDateString()
  @IsOptional()
  expected_payout_date?: Date | null;

  @IsDateString()
  @IsNotEmpty()
  application_date: Date;

  @IsNumber()
  @IsNotEmpty()
  loan_amount: number;

  @IsNumber()
  @IsNotEmpty()
  revenue_forecast: number;
  @IsNumber()
  @IsNotEmpty()
  outstanding_receivable_total: number;

  @IsEnum(PayType)
  @IsNotEmpty()
  pay_type: PayType;

  @IsNumber()
  @IsNotEmpty()
  loan_tenor: number;
}
