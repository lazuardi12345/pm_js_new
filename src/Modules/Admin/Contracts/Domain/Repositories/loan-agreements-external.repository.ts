//! MODULE CONTRACTS
import { LoanAgreement } from '../Entities/loan-agreements.entity';

export const LOAN_AGREEMENT_REPOSITORY = 'LOAN_AGREEMENT_REPOSITORY';

export interface ILoanAgreementRepository {
  findById(id: number): Promise<LoanAgreement | null>;
  //   findByNasabahId(nasabahId: number): Promise<LoanAgreement[]>;
  findAll(): Promise<LoanAgreement[]>;
  save(loanAggrement: LoanAgreement): Promise<LoanAgreement>;
  update(id: number, address: Partial<LoanAgreement>): Promise<LoanAgreement>;
  delete(id: number): Promise<void>;
}
