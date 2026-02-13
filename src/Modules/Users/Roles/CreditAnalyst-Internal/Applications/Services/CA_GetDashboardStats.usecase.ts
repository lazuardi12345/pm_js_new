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

  async execute(
    creditAnalystId: number,
    type: string,
    year?: number,
    month?: number,
    week?: number,
  ) {
    // ambil data dari SP
    const stats = await this.loanAppRepo.callSP_CA_GetDashboard_Internal(
      creditAnalystId,
      type,
      year,
      month,
      week,
    );

    // kalau gak ada data dari SP
    if (!stats || stats.length === 0) {
      return {
        error: true,
        message: `Approval statistics for CA ID ${creditAnalystId} not found`,
        reference: 'APPROVAL_STATS_NOT_FOUND',
        data: null,
      };
    }

    // return hasil
    return {
      error: false,
      message: 'Approval statistics retrieved successfully',
      reference: 'APPROVAL_STATS_OK',
      data: stats,
    };
  }
}
