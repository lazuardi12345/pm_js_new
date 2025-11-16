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
    try {
      // ================================
      // 1. VALIDASI INPUT
      // ================================
      if (
        marketingId === null ||
        marketingId === undefined ||
        Number.isNaN(Number(marketingId))
      ) {
        return {
          error: true,
          message: 'Invalid marketingId',
          reference: 'INVALID_MARKETING_ID',
          data: null,
        };
      }

      // ================================
      // 2. CALL SP
      // ================================
      let stats: any;

      try {
        stats = await this.loanAppRepo.callSP_MKT_GetDashboard_Internal(
          Number(marketingId),
        );
      } catch (err) {
        console.error('SP ERROR:', err);

        // Misal database down / koneksi gagal
        if (err?.code === 'ECONNREFUSED' || err?.name === 'MongoNetworkError') {
          return {
            error: true,
            message: 'Database connection error',
            reference: 'DB_CONNECTION_ERROR',
            data: null,
          };
        }

        return {
          error: true,
          message: 'Failed to retrieve dashboard statistics',
          reference: 'DASHBOARD_STATS_SP_ERROR',
          data: null,
        };
      }

      // ================================
      // 3. HANDLE KALAU DATA KOSONG
      // ================================
      if (!stats || typeof stats !== 'object') {
        return {
          error: true,
          message: `Dashboard stats for Marketing ID ${marketingId} not found`,
          reference: 'DASHBOARD_STATS_NOT_FOUND',
          data: null,
        };
      }

      // ================================
      // 4. NORMALISASI AMAN (TANPA UBAH STRUCTURE)
      // ================================
      const safeNum = (val: any) => {
        const n = Number(val);
        return Number.isFinite(n) ? n : 0;
      };

      const total_loans = safeNum(stats.total_loans);
      const approved_loans = safeNum(stats.approved_loans);
      const rejected_loans = safeNum(stats.rejected_loans);

      // ================================
      // 5. RETURN FINAL (STRUCTURE TETAP)
      // ================================
      return {
        error: false,
        message: 'Marketing dashboard statistics retrieved successfully',
        reference: 'DASHBOARD_STATS_OK',
        data: {
          total_loans,
          approved_loans,
          rejected_loans,
        },
      };
    } catch (err) {
      console.error('UNEXPECTED ERROR:', err);

      // fallback aman
      return {
        error: true,
        message:
          err?.message || 'Unexpected error while retrieving dashboard stats',
        reference: 'DASHBOARD_UNKNOWN_ERROR',
        data: null,
      };
    }
  }
}
