import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY,
  IDraftRepeatOrderExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/DraftRepeatOrder.repository';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';

type DraftUnifiedResponse = {
  id: string;
  nama_lengkap: string;
  no_ktp: string;
  no_hp: string;
  nominal_pinjaman: number;
  tenor: string | number;
  createdAt: Date | string;
  draft_type: 'new' | 'ro';
};

@Injectable()
export class SPV_GetDraftByMarketingIdUseCase {
  constructor(
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanDraftRepo: ILoanApplicationDraftExternalRepository,

    @Inject(DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY)
    private readonly repeatOrderRepo: IDraftRepeatOrderExternalRepository,
  ) {}

  async execute(marketingId: number): Promise<DraftUnifiedResponse[]> {
    const [loanDrafts, repeatDrafts] = await Promise.all([
      this.loanDraftRepo.findByMarketingId(marketingId),
      this.repeatOrderRepo.findByMarketingId(marketingId),
    ]);

    const activeLoanDrafts = loanDrafts.filter((d) => !d.isCompleted);
    const activeRepeatDrafts = repeatDrafts.filter((d) => !d.isCompleted);

    if (!activeLoanDrafts.length && !activeRepeatDrafts.length) {
      throw new NotFoundException(
        `Tidak ada draft aktif untuk marketing ID ${marketingId}`,
      );
    }

    const formattedLoanDrafts: DraftUnifiedResponse[] = activeLoanDrafts.map(
      (d: any) => ({
        id: d._id,
        nama_lengkap: d.client_external?.nama_lengkap || '-',
        no_ktp: d.client_external?.nik || '-',
        no_hp: d.client_external?.no_hp || '-',
        nominal_pinjaman: d.loan_application_external?.nominal_pinjaman || 0,
        tenor: d.loan_application_external?.tenor ?? 'Belum diset Marketing',
        createdAt: d.createdAt ?? '-',
        draft_type: 'new',
      }),
    );

    const formattedRepeatDrafts: DraftUnifiedResponse[] =
      activeRepeatDrafts.map((d: any) => ({
        id: d._id,
        nama_lengkap: d.client_external?.nama_lengkap || '-',
        no_ktp: d.client_external?.nik || '-',
        no_hp: d.client_external?.no_hp || '-',
        nominal_pinjaman: d.nominal_pinjaman || 0,
        tenor: d.tenor ?? '-',
        createdAt: d.createdAt ?? '-',
        draft_type: 'ro',
      }));

    return [...formattedLoanDrafts, ...formattedRepeatDrafts];
  }
}
