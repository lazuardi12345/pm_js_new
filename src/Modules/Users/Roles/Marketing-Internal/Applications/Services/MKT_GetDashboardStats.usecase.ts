import { Inject, Injectable } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class MKT_GetDashboardStatsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(marketingId: number) {
    // ambil data dari SP
    const stats =
      await this.loanAppRepo.callSP_MKT_GetDashboard_Internal(marketingId);

    // kalau gak ada data dari SP
    if (!stats) {
      return {
        error: true,
        message: `Dashboard stats for Marketing ID ${marketingId} not found`,
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
        total_loans: stats.total_loans,
        approved_loans: stats.approved_loans,
        rejected_loans: stats.rejected_loans,
      },
    };
  }
}
