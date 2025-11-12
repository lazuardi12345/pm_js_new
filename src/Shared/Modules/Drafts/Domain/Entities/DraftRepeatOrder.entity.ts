import { Types } from 'mongoose';

export class RepeatOrderEntity {
  readonly _id?: string | Types.ObjectId;
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
  isNeedCheck?: boolean;
  payload: any;

  constructor(partial: Partial<RepeatOrderEntity>) {
    Object.assign(this, partial);
  }
}
