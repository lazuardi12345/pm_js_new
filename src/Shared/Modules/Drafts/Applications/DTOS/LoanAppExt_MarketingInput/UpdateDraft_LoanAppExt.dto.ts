import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftLoanApplicationExtDto } from './CreateDraft_LoanAppExt.dto';

export class UpdateDraftLoanApplicationExtDto extends PartialType(
  CreateDraftLoanApplicationExtDto,
) {}
