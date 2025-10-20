import { Inject, Injectable } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class CA_GetDashboardStatsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(creditAnalystId: number) {
    // ambil data dari SP
    const stats =
      await this.loanAppRepo.callSP_CA_GetDashboard_Internal(creditAnalystId);

    // kalau gak ada data dari SP
    if (!stats) {
      return {
        error: true,
        message: `Dashboard stats for SPV ID ${creditAnalystId} not found`,
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
