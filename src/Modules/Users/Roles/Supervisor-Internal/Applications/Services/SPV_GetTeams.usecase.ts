import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY,
  ILoanApplicationDraftRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/int/LoanAppInt.repository';
import { TeamStats } from 'src/Shared/Interface/SPV_GetTeams/SPV_GetTeamsStats.interface';

@Injectable()
export class SPV_GetTeamsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY)
    private readonly createDraftRepo: ILoanApplicationDraftRepository,
  ) {}

  async execute(spv_id: number) {
    const teamsWithApprovedOrRejected =
      await this.loanAppRepo.callSP_SPV_GetAllTeams_Internal(spv_id);

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
