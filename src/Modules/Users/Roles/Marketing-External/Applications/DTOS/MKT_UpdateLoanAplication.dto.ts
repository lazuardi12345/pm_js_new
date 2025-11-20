import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanApplicationExternalDto } from './MKT_CreateLoanApplicationExternal.dto';

export class UpdateLoanApplicationExternalDto extends PartialType(
  CreateLoanApplicationExternalDto,
) {}
