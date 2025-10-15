export class LoanApplicationEntity {
  id?: string;
  marketing_id?: number;

  client_internal: any;
  address_internal?: any;
  family_internal?: any;
  job_internal?: any;
  loan_application_internal?: any;
  collateral_internal?: any;
  relative_internal?: any;

  uploaded_files?: any;
  isDeleted?: boolean;
  isCompleted?: boolean;
  payload: any;

  constructor(partial: Partial<LoanApplicationEntity>) {
    Object.assign(this, partial);
  }
}
