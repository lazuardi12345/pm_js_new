import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  StatusPengajuanAkhirEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

@Injectable()
export class MKT_GetClientsDatabaseUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(p_page = 1, p_pageSize = 10) {
    try {
      const { pagination, ClientData, ClientHistoryLoanApplicationsData } =
        await this.loanAppRepo.callSP_GENERAL_GetClientDatabaseInternal(
          p_page,
          p_pageSize,
        );

      const total = pagination.total ?? 0;
      const page = pagination.page ?? p_page;
      const pageSize = pagination.page_size ?? p_pageSize;

      // Normalisasi data client
      const normalizedClients = ClientData.map((c) => ({
        ...c,
        id: Number(c.id),
        nasabah_id: Number(c.id),
      }));

      const normalizedLoans =
        ClientHistoryLoanApplicationsData?.map((l) => {
          const akhir = l.status_akhir_pengajuan?.toLowerCase() ?? '';
          const status = l.status_pengajuan?.toLowerCase() ?? '';

          const finalHMStatuses = [
            StatusPengajuanEnum.APPROVED_HM.toLowerCase(),
            StatusPengajuanEnum.REJECTED_HM.toLowerCase(),
            StatusPengajuanEnum.APPROVED_BANDING_HM.toLowerCase(),
            StatusPengajuanEnum.REJECTED_BANDING_HM.toLowerCase(),
          ];

          const isFinalHM = finalHMStatuses.includes(status);
          const isClosed = ['done', 'closed'].includes(akhir) && isFinalHM;

          const adjustedAkhir = isClosed ? akhir : 'in_progress';

          return {
            ...l,
            id: Number(l.id),
            nasabah_id: Number(l.nasabah_id),
            status_akhir_pengajuan: adjustedAkhir,
          };
        }) ?? [];

      const loansByClient = normalizedLoans.reduce(
        (acc, loan) => {
          if (!acc[loan.nasabah_id]) acc[loan.nasabah_id] = [];
          acc[loan.nasabah_id].push(loan);
          return acc;
        },
        {} as Record<number, any[]>,
      );

      const mergedData = normalizedClients.map((client) => ({
        ...client,
        loanApplications: loansByClient[client.nasabah_id] || [],
      }));

      return {
        payload: {
          error: false,
          message: 'Client Database successfully retrieved',
          reference: 'CLIENT_DATABASE_OK',
          data: {
            results: mergedData,
          },
          total,
          page,
          pageSize,
        },
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data client database');
    }
  }
}
