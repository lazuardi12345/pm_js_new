import { Types } from 'mongoose';

export class RepeatOrderExternalEntity {
  readonly _id?: string | Types.ObjectId;
  id?: string;
  marketing_id?: number;

  client_external: any;
  address_external?: any;
  job_external?: any;
  loan_application_external?: any;
  loan_guarantor_external?: any;
  emergency_contact_external?: any;
  financial_dependents_external: any;
  other_exist_loan_external?: any;

  collateral_bpjs?: any;
  collateral_bpkb?: any;
  collateral_kedinasan_mou?: any;
  collateral_kedinasan_non_mou?: any;
  collateral_shm?: any;
  collateral_umkm?: any;

  uploaded_files?: any;
  isDeleted?: boolean;
  isCompleted?: boolean;
  isNeedCheck?: boolean;
  payload: any;

  constructor(partial: Partial<RepeatOrderExternalEntity>) {
    Object.assign(this, partial);
  }
}
