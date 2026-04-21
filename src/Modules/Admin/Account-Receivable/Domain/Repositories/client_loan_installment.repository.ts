// Domain/Repositories/IClientLoanInstallmentRepository.ts

import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';
import { ClientLoanInstallment } from '../Entities/client_loan_installment.entity';

export const CLIENT_LOAN_INSTALLMENT_REPOSITORY = Symbol(
  'CLIENT_LOAN_INSTALLMENT_REPOSITORY',
);

export interface IClientLoanInstallmentRepository {
  create(entity: ClientLoanInstallment): Promise<ClientLoanInstallment>;
  update(
    id: string,
    entity: Partial<ClientLoanInstallment>,
  ): Promise<ClientLoanInstallment>;
  findAll(): Promise<ClientLoanInstallment[]>;
  findById(id: string): Promise<ClientLoanInstallment | null>;
  findByFrequencyId(frequency_id: string): Promise<ClientLoanInstallment[]>;
  delete(id: string): Promise<void>;

  findByFrequencyIdFromNumber(
    frequency_id: string,
    from_frequency_number: number,
  ): Promise<
    { id: string; frequency_number: number; status: InstallmentStatus }[]
  >;

  bulkUpdateStatusByIds(
    ids: string[],
    status: InstallmentStatus,
  ): Promise<void>;

  callSP_AdAR_GetClientInstallmentDetailByUUID(
    installmentId: string,
    frequencyId: string,
  ): Promise<any[]>;
}
