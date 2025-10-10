import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanApplicationInternalDto } from './create-loan-application.dto';

export class UpdateLoanAplicationInternalDto extends PartialType(
  CreateLoanApplicationInternalDto,
) {}
