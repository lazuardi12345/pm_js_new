import { Inject, Injectable } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class SPV_GetDashboardStatsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(supervisorId: number) {
    // ambil data dari SP
    const stats =
      await this.loanAppRepo.callSP_SPV_GetDashboard_External(supervisorId);

    // kalau gak ada data dari SP
    if (!stats) {
      return {
        error: true,
        message: `Dashboard stats for SPV ID ${supervisorId} not found`,
        reference: 'DASHBOARD_STATS_NOT_FOUND',
        data: null,
      };
    }

    // return hasil marketing doang
    return {
      error: false,
      message: 'Marketing dashboard statistics retrieved successfully',
      reference: 'DASHBOARD_STATS_OK',
      data: {
        total_loans: stats.approval_request,
        approved_loans: stats.approved_request,
        rejected_loans: stats.rejected_request,
      },
    };
  }
}
