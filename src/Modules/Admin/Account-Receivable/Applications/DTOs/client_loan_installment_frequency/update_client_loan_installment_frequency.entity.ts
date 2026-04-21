// Application/DTOs/dto-ClientInstallmentFrequency/update-client-installment-frequency.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInstallmentFrequencyDto } from './create_client_loan_installment_frequency.entity';

export class UpdateClientInstallmentFrequencyDto extends PartialType(
  CreateClientInstallmentFrequencyDto,
) {}
