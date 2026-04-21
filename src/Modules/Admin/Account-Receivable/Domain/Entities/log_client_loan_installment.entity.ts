// Domain/Entities/log_client_loan_installment_status.entity.ts

import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

export class LogClientLoanInstallment {
  constructor(
    public installment_id: string,
    public previous_status: InstallmentStatus,
    public new_status: InstallmentStatus,
    public changer_id: number,
    public changed_by: string,

    public readonly id?: string,
    public readonly changed_at?: Date,
  ) {}
}
