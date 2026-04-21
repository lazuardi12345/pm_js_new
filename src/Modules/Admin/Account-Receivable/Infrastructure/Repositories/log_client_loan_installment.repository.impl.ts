// Infrastructure/Repositories/log-client-loan-installment-status.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';
import { ILogClientLoanInstallmentRepository } from '../../Domain/Repositories/log_client_loan_installment.repository';
import { LogClientLoanInstallment_ORM_Entity } from '../Entities/log_client_loan_installment.orm-entity';

@Injectable()
export class LogClientLoanInstallmentRepositoryImpl
  implements ILogClientLoanInstallmentRepository
{
  constructor(
    @InjectRepository(LogClientLoanInstallment_ORM_Entity)
    private readonly ormRepository: Repository<LogClientLoanInstallment_ORM_Entity>,
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
    if (!entries.length) return;
    await this.ormRepository.insert(entries);
  }
}
