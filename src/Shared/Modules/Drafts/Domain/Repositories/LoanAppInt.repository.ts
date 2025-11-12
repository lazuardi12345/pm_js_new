import { LoanApplicationEntity } from '../Entities/LoanAppInt.entity';

export const CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY = Symbol(
  'CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY',
);

export interface ILoanApplicationDraftRepository {
  create(data: Partial<LoanApplicationEntity>): Promise<LoanApplicationEntity>;
  findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null>;
  findById(id: string): Promise<LoanApplicationEntity | null>;
  findByMarketingId(marketingId: number): Promise<LoanApplicationEntity[]>;
  updateDraftById(
    id: string,
    updateData: Partial<LoanApplicationEntity>,
  ): Promise<{ entity: LoanApplicationEntity | null; isUpdated: boolean }>;
  triggerIsNeedCheckBeingTrue(
    draft_id?: string,
    nominal_pinjaman?: number,
  ): Promise<void>;
  softDelete(id: string): Promise<void>;
}
