import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class SPV_GetTeamsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(spv_id: number) {
    const teams =
      await this.loanAppRepo.callSP_SPV_GetAllTeams_Internal(spv_id);
    if (!teams.length) {
      throw new NotFoundException('Tidak ada data tim di bawah supervisor ini');
    }

    return {
      teams: teams.map((team) => ({
        name: team.user_nama,
        email: team.email,
        role: team.type,
        join_date: team.join_date,
      })),
    };
  }
}
