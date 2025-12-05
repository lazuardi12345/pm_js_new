import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';
import { TeamStats } from 'src/Shared/Interface/SPV_GetTeams/SPV_GetTeamsStats.interface';

@Injectable()
export class SPV_GetTeamsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly createDraftRepo: ILoanApplicationDraftExternalRepository,
  ) {}

  async execute(spv_id: number) {
    const teamsWithApprovedOrRejected =
      await this.loanAppRepo.callSP_SPV_GetAllTeams_External(spv_id);

    if (!teamsWithApprovedOrRejected.length) {
      throw new NotFoundException('Tidak ada data tim di bawah supervisor ini');
    }

    const teams: TeamStats[] = await Promise.all(
      teamsWithApprovedOrRejected.map(async (team) => {
        const drafts = await this.createDraftRepo.findByMarketingId(
          team.mkt_id,
        );
        const draftCount = drafts.filter((d) => !d.isCompleted).length;

        return {
          mkt_id: team.mkt_id,
          nama: team.nama,
          email: team.email,
          approved: team.approved,
          rejected: team.rejected,
          draft: draftCount,
        };
      }),
    );

    return { teams };
  }
}
