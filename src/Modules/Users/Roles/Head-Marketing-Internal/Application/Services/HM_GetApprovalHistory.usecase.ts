// src/Modules/LoanAppInternal/Application/hm-get-all-loan-application.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetAllApprovalHistoryUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    headMarketingId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      console.log(
        'HM ID:',
        headMarketingId,
        'page:',
        page,
        'pageSize:',
        pageSize,
      );

      const { data, total } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalHistory_ByTeam(
          headMarketingId,
          page,
          pageSize,
        );

      if (!data) {
        throw new Error('Data pengajuan tidak ditemukan');
      }

      // Filter pencarian (search)
      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nasabah_nama
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
        : data;

      // Format nominal pinjaman
      const formattedData = filteredData.map((item) => ({
        id_pengajuan: Number(item.loan_id),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nasabah_nama,
        nominal_pinjaman: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item.nominal_pinjaman)),
        id_marketing: Number(item.user_id),
        nama_marketing: item.marketing_nama,
        status: item.loan_status,
      }));

      return { data: formattedData, total };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan oleh HM');
    }
  }
}
