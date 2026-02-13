import { Inject, Injectable } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class MKT_GetDashboardStatsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(marketingId: number, type: 'internal' | 'external') {
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

      if (!type || !['internal', 'external'].includes(type)) {
        return {
          error: true,
          message: 'Invalid type. Must be internal or external',
          reference: 'INVALID_TYPE',
          data: null,
        };
      }

      // ================================
      // 2. CALL SP
      // ================================
      let stats: any;

      try {
        stats = await this.loanAppRepo.callSP_MKT_GetDashboard_External(
          Number(marketingId),
          type,
        );
      } catch (err) {
        console.error('SP ERROR:', err);

        // Handle specific SQL errors
        if (err?.message?.includes('SPV ID not found')) {
          return {
            error: true,
            message: 'SPV ID not found for this marketing',
            reference: 'SPV_ID_NOT_FOUND',
            data: null,
          };
        }

        // Database connection error
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
      // 4. NORMALISASI AMAN (5 PARAMETERS DARI SP)
      // ================================
      const safeNum = (val: any) => {
        const n = Number(val);
        return Number.isFinite(n) ? n : 0;
      };

      const pending = safeNum(stats.pending);
      const approved_by_spv = safeNum(stats.approved_by_spv);
      const rejected_by_spv = safeNum(stats.rejected_by_spv);
      const success = safeNum(stats.success);
      const canceled = safeNum(stats.canceled);

      // ================================
      // 5. RETURN FINAL (SESUAI STRUCTURE SP)
      // ================================
      return {
        error: false,
        message: 'Marketing dashboard statistics retrieved successfully',
        reference: 'DASHBOARD_STATS_OK',
        data: {
          pending,
          approved: approved_by_spv,
          rejected: rejected_by_spv,
          success,
          canceled,
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
