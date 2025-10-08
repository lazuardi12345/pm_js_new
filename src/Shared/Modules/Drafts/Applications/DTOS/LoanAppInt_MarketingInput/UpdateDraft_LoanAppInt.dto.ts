import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftLoanApplicationDto } from './CreateDraft_LoanAppInt.dto';
import { PayloadDTO } from './CreateDraft_LoanAppInt.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDraftLoanApplicationDto extends PartialType(CreateDraftLoanApplicationDto) {

  // Tambahkan ini agar bisa terima langsung tanpa "payload"
  client_internal?: any;
  address_internal?: any;
  family_internal?: any;
  job_internal?: any;
  loan_application_internal?: any;
  collateral_internal?: any;
  relative_internal?: any;
}
