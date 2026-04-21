// Application/Services/log_client_loan_installment_status.service.ts

import { Injectable, Inject } from '@nestjs/common';

import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';
import {
  ILogClientLoanInstallmentRepository,
  LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY,
} from '../../Domain/Repositories/log_client_loan_installment.repository';
import { LogClientLoanInstallment } from '../../Domain/Entities/log_client_loan_installment.entity';

@Injectable()
export class LogClientLoanInstallmentService {
  constructor(
    @Inject(LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY)
    private readonly logRepository: ILogClientLoanInstallmentRepository,
  ) {}

  async bulkCreateLog(
    entries: {
      installment_id: string;
      previous_status: InstallmentStatus;
      new_status: InstallmentStatus;
      changer_id: number;
      changed_by: string;
    }[],
  ): Promise<void> {
    const entities = entries.map(
      (entry) =>
        new LogClientLoanInstallment(
          entry.installment_id,
          entry.previous_status,
          entry.new_status,
          entry.changer_id,
          entry.changed_by,
        ),
    );

    return this.logRepository.bulkCreateLog(
      entities.map((e) => ({
        installment_id: e.installment_id,
        previous_status: e.previous_status,
        new_status: e.new_status,
        changer_id: e.changer_id,
        changed_by: e.changed_by,
      })),
    );
  }
}
