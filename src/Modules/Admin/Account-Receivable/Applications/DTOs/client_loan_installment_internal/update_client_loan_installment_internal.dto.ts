// Application/DTOs/dto-ClientLoanInstallmentInternal/update-client-loan-installment-internal.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateClientLoanInstallmentInternalDto } from './create_client_loan_installment_internal.dto';

export class UpdateClientLoanInstallmentInternalDto extends PartialType(
  CreateClientLoanInstallmentInternalDto,
) {}
