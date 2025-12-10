import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanAgreementDto } from './create-loan-agreement.dto';

export class UpdateLoanAgreementDto extends PartialType(
  CreateLoanAgreementDto,
) {}
