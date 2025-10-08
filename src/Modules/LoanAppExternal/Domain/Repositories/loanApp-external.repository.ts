// Domain/Repositories/approval-external.repository.ts
import { LoanApplicationExternal } from "../Entities/loanApp-external.entity";

export const LOAN_APPLICATION_EXTERNAL_REPOSITORY = ' LOAN_APPLICATION_EXTERNAL_REPOSITORY';

export interface ILoanApplicationExternalRepository {
  findById(id: number): Promise<LoanApplicationExternal | null>;
  findByNasabahId(nasabahId: number): Promise<LoanApplicationExternal[]>;
  findAll(): Promise<LoanApplicationExternal[]>;
  save(address: LoanApplicationExternal): Promise<LoanApplicationExternal>;
  update(
    id: number,
    address: Partial<LoanApplicationExternal>,
  ): Promise<LoanApplicationExternal>;
  delete(id: number): Promise<void>;
}
