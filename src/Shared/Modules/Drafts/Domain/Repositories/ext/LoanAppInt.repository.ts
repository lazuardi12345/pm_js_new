import { LoanApplicationExtEntity } from '../../Entities/ext/LoanAppExt.entity';

export const DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY = Symbol(
  'CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY',
);

export interface ILoanApplicationDraftExternalRepository {
  create(
    data: Partial<LoanApplicationExtEntity>,
  ): Promise<LoanApplicationExtEntity>;
  findStatus(
    nik: string,
  ): Promise<{ draft_id: string; isNeedCheck: boolean } | null>;
  findById(id: string): Promise<LoanApplicationExtEntity | null>;
  findByMarketingId(marketingId: number): Promise<LoanApplicationExtEntity[]>;
  updateDraftById(
    id: string,
    updateData: Partial<LoanApplicationExtEntity>,
  ): Promise<{ entity: LoanApplicationExtEntity | null; isUpdated: boolean }>;
  triggerIsNeedCheckBeingTrue(
    draft_id?: string,
    nominal_pinjaman?: number,
  ): Promise<void>;
  softDelete(id: string): Promise<boolean>;
}
