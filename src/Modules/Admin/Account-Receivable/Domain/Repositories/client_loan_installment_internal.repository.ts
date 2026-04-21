// Domain/Repositories/IClientLoanInstallmentInternalRepository.ts

import { ClientLoanInstallmentInternal } from '../Entities/client_loan_installment_internal.entity';

export const CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY = Symbol(
  'CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY',
);

export interface IClientLoanInstallmentInternalRepository {
  create(
    entity: ClientLoanInstallmentInternal,
  ): Promise<ClientLoanInstallmentInternal>;
  update(
    id: string,
    entity: Partial<ClientLoanInstallmentInternal>,
  ): Promise<ClientLoanInstallmentInternal>;
  findAll(): Promise<ClientLoanInstallmentInternal[]>;
  findById(id: string): Promise<ClientLoanInstallmentInternal | null>;
  findByNik(nik: number): Promise<ClientLoanInstallmentInternal | null>; // ← tambah ini
  delete(id: string): Promise<void>;

  callSP_GetAllClientLoanInstallmentInternal(
    searchByClientName: string | null,
    companyName: string | null, // ← tambah
    page: number,
    pageSize: number,
  ): Promise<any[]>;

  callSP_AdAR_GetClientDetailByUUID(
    clientId: string,
    loanFrequency: number | null,
  ): Promise<any[]>;
}
