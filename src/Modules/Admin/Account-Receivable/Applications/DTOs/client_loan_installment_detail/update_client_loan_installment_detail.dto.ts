// Application/DTOs/dto-ClientLoanInstallmentDetail/update-client-loan-installment-detail.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateClientLoanInstallmentDetailDto } from './create_client_loan_installment_detail.dto';
export class UpdateClientLoanInstallmentDetailDto extends PartialType(
  CreateClientLoanInstallmentDetailDto,
) {}
