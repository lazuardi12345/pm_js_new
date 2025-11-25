import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftLoanApplicationIntDto } from './CreateDraft_LoanAppInt.dto';

export class UpdateDraftLoanApplicationDto extends PartialType(
  CreateDraftLoanApplicationIntDto,
) {
  // Tambahkan ini agar bisa terima langsung tanpa "payload"
  client_internal?: any;
  address_internal?: any;
  family_internal?: any;
  job_internal?: any;
  loan_application_internal?: any;
  collateral_internal?: any;
  relative_internal?: any;
}
