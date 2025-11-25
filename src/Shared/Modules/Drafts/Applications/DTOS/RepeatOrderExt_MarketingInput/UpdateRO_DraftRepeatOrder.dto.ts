import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftRepeatOrderExtDto } from './CreateRO_DraftRepeatOrder.dto';

export class UpdateDraftRepearOrderExtDto extends PartialType(
  CreateDraftRepeatOrderExtDto,
) {
  // Tambahkan ini agar bisa terima langsung tanpa "payload"
  client_external?: any;
  address_external?: any;
  job_external?: any;
  loan_application_external?: any;
  loan_guarantor_external?: any;
  financial_dependents_external?: any;
  other_exist_loan_external?: any;
  emergency_contact_external?: any;
  collateral_bpjs?: any;
  collateral_bpkb: any;
  collateral_shm: any;
  collateral_umkm: any;
  collateral_kedinasan_mou: any;
  collateral_kedinasan_non_mou: any;
}
