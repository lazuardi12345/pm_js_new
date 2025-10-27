import { LoanApplicationEntity } from '../Entities/LoanAppInt.entity';

export const CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY = Symbol(
  'CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY',
);

export interface ILoanApplicationDraftRepository {
  create(data: Partial<LoanApplicationEntity>): Promise<LoanApplicationEntity>;
  findById(id: string): Promise<LoanApplicationEntity | null>;
  findByMarketingId(marketingId: number): Promise<LoanApplicationEntity[]>;

  updateDraftById(
    id: string,
    updateData: Partial<LoanApplicationEntity>,
  ): Promise<{ entity: LoanApplicationEntity | null; isUpdated: boolean }>;

  softDelete(id: string): Promise<void>;
}
