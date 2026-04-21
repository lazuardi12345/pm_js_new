// Domain/Repositories/IClientLoanInstallmentDetailRepository.ts

import { ClientLoanInstallmentDetail } from '../Entities/client_loan_installment_detail.entity';

export const CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY = Symbol(
  'CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY',
);

export interface IClientLoanInstallmentDetailRepository {
  create(
    entity: ClientLoanInstallmentDetail,
  ): Promise<ClientLoanInstallmentDetail>;
  update(
    id: string,
    entity: Partial<ClientLoanInstallmentDetail>,
  ): Promise<ClientLoanInstallmentDetail>;
  findAll(): Promise<ClientLoanInstallmentDetail[]>;
  findById(id: string): Promise<ClientLoanInstallmentDetail | null>;
  findByInstallmentId(
    installment_id: string,
  ): Promise<ClientLoanInstallmentDetail[]>;
  delete(id: string): Promise<void>;

  createPayment(
    installmentId: string,
    amountPaid: number,
    payDate: string,
    payDescription: string | null,
  ): Promise<ClientLoanInstallmentDetail>;
}
