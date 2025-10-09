import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILoanApplicationInternalRepository, LOAN_APPLICATION_INTERNAL_REPOSITORY } from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetTeamsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(hm_id: number) {
    const teams = await this.loanAppRepo.callSP_SPV_GetAllTeams_Internal(hm_id);

    if (!teams.length) {
      throw new NotFoundException('Tidak ada data tim di bawah HM ini');
    }

    return {
      teams: teams.map((team) => ({
        name: team.nama,
        email: team.email,
        role: team.usertype,
      })),
    };
  }
}
