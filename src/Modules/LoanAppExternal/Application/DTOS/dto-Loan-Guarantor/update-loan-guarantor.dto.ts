import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanGuarantorExternalDto } from './create-loan-guarantor.dto';

export class UpdateLoanGuarantorExternalDto extends PartialType(
  CreateLoanGuarantorExternalDto,
) {}
