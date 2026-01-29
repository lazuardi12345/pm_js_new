import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  StatusPengajuanAkhirEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

@Injectable()
export class MKT_GetAllRepeatOrderHistoryUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(p_marketing_id: number, p_page = 1, p_pageSize = 10) {
    try {
      const { pagination, ClientData, ClientHistoryLoanApplicationsData } =
        await this.loanAppRepo.callSP_MKT_GetAllRepeatOrderHistory_External(
          p_marketing_id,
          p_page,
          p_pageSize,
        );

      console.log(pagination, ClientData, ClientHistoryLoanApplicationsData);

      /** ============================================
       *  PAGINATION NORMALIZATION
       * ============================================ */
      const total = Number(pagination?.total ?? 0);
      const page = Number(pagination?.page ?? p_page);
      const pageSize = Number(pagination?.page_size ?? p_pageSize);

      /** ============================================
       *  RESULT SET 2 → NORMALIZE CLIENT DATA
       *  (SUDAH SESUAI ALIAS SP BARU)
       * ============================================ */
      const normalizedClients =
        ClientData?.map((c: any) => ({
          ...c,
          id: Number(c.id),
          nasabah_id: Number(c.id),
          marketing_id: Number(c.marketing_id),
          // points: Number(c.points ?? 0),
          profile_id: c.profile_id ? Number(c.profile_id) : null,
        })) ?? [];

      /** ============================================
       * RESULT SET 3 → NORMALIZE LOAN HISTORY
       * (SUDAH SESUAI ALIAS SP BARU)
       * ============================================ */
      const normalizedLoans =
        ClientHistoryLoanApplicationsData?.map((l: any) => {
          const statusPengajuan = l.status_pengajuan?.toLowerCase() ?? '';
          const akhir = l.status_akhir_pengajuan?.toLowerCase() ?? '';

          const finalHMStatuses = [
            StatusPengajuanEnum.APPROVED_HM.toLowerCase(),
            StatusPengajuanEnum.REJECTED_HM.toLowerCase(),
            StatusPengajuanEnum.APPROVED_BANDING_HM.toLowerCase(),
            StatusPengajuanEnum.REJECTED_BANDING_HM.toLowerCase(),
          ];

          const isFinalHM = finalHMStatuses.includes(statusPengajuan);
          const isClosed = ['done', 'closed'].includes(akhir) && isFinalHM;

          const adjustedAkhir = isClosed ? akhir : 'in_progress';

          return {
            ...l,
            id: Number(l.id),
            nasabah_id: Number(l.nasabah_id),
            nominal_pinjaman: Number(l.nominal_pinjaman ?? 0),
            tenor: Number(l.tenor ?? 0),
            status_akhir_pengajuan: adjustedAkhir,
          };
        }) ?? [];

      /** ============================================
       *  GROUP LOANS BY CLIENT
       * ============================================ */
      const loansByClient = normalizedLoans.reduce(
        (acc: Record<number, any[]>, loan) => {
          if (!acc[loan.nasabah_id]) acc[loan.nasabah_id] = [];
          acc[loan.nasabah_id].push(loan);
          return acc;
        },
        {},
      );

      const mergedData = normalizedClients.map((client) => ({
        ...client,
        loanApplications: loansByClient[client.nasabah_id] || [],
      }));

      return {
        payload: {
          error: false,
          message: 'Repeat Order Data successfully retrieved',
          reference: 'REPEAT_ORDER_OK',
          data: {
            results: mergedData,
          },
          total,
          page,
          pageSize,
        },
      };
    } catch (err) {
      console.error('=== ERROR execute (GetAllRepeatOrderHistory) ===');
      console.error(err);

      // Forward HttpException as-is
      if (err instanceof HttpException) throw err;

      // DB connectivity
      if (err?.name === 'MongoNetworkError' || err?.code === 'ECONNREFUSED') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database connection error',
              reference: 'DB_CONNECTION_ERROR',
            },
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // CastError / invalid types
      if (err?.name === 'CastError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Invalid data format',
              reference: 'INVALID_DATA_FORMAT',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Final fallback (don't leak internals)
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err?.message || 'Failed to retrieve repeat order data',
            reference: 'REPEAT_ORDER_FETCH_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
