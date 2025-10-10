import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanApplicationExternalDto } from './create-loan-application.dto';

export class UpdateLoanApplicationExternalDto extends PartialType(
  CreateLoanApplicationExternalDto,
) {}
