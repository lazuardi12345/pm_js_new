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
  generateAndSave(loanData: Partial<LoanAgreement>): Promise<LoanAgreement>;

  //? Store Procedure Interface Repo
  callSP_AdCont_GetAllLoanAgreementData(
    searchNomorKontrak: string | null,
    searchNoKtp: number | null,
    searchNama: string | null,
    page: number,
    pageSize: number,
  ): Promise<any[]>;

  callSP_AdCont_GetLoanInquiry(nik: string): Promise<any[]>;

  callSP_AdAR_GetAllClientSearchData(
    nama: string | null,
    no_ktp: number | null,
    id_card: string | null,
  ): Promise<any[]>;
}
