// AdAR_CreateInstallmentPayment.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdAR_CreateInstallmentPaymentDto {
  @IsNotEmpty()
  @IsString()
  installment_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount_paid: number;

  @IsNotEmpty()
  @IsDateString()
  pay_date: string;

  @IsOptional()
  @IsString()
  pay_description?: string;
}
