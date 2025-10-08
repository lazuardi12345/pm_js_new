// Domain/Repositories/approval-external.repository.ts
import { LoanGuarantorExternal } from "../Entities/loan-guarantor-external.entity";

export const LOAN_GUARANTOR_EXTERNAL_REPOSITORY = ' LOAN_GUARANTOR_EXTERNAL_REPOSITORY';

export interface ILoanGuarantorExternalRepository {
  findById(id: number): Promise<LoanGuarantorExternal | null>;
  findByNasabahId(nasabahId: number): Promise<LoanGuarantorExternal[]>;
  findAll(): Promise<LoanGuarantorExternal[]>;
  save(address: LoanGuarantorExternal): Promise<LoanGuarantorExternal>;
  update(
    id: number,
    address: Partial<LoanGuarantorExternal>,
  ): Promise<LoanGuarantorExternal>;
  delete(id: number): Promise<void>;
}
