// Application/DTOs/dto-ClientLoanInstallmentDetail/create-client-loan-installment-detail.dto.ts

import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClientLoanInstallmentDetailDto {
  @IsUUID()
  @IsNotEmpty()
  installment_id: string; // FK → tbl_client_loan_installment

  @IsNumber()
  @IsNotEmpty()
  amount_paid: number;

  @IsDateString()
  @IsNotEmpty()
  pay_date: Date;

  @IsString()
  @IsNotEmpty()
  pay_description: string;
}
