// Domain/Repositories/log_client_loan_installment_status.repository.ts

import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

export const LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY = Symbol(
  'LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY',
);

export interface ILogClientLoanInstallmentRepository {
  bulkCreateLog(
    entries: {
      installment_id: string;
      previous_status: InstallmentStatus;
      new_status: InstallmentStatus;
      changer_id: number;
      changed_by: string;
    }[],
  ): Promise<void>;
}
