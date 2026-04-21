// Application/DTOs/dto-ClientLoanInstallment/update-client-loan-installment.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateClientLoanInstallmentDto } from './create_client_loan_installment.dto';

export class UpdateClientLoanInstallmentDto extends PartialType(
  CreateClientLoanInstallmentDto,
) {}
