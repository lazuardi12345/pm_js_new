import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class SPV_GetAllApproval_ByTeam_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    supervisorId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      console.log(
        'SPV ID:',
        supervisorId,
        'Page:',
        page,
        'PageSize:',
        pageSize,
        'Search:',
        searchQuery,
      );

      const { data, total: totalFromSP } =
        await this.loanAppRepo.callSP_SPV_GetAllApprovalHistory_ByTeam(
          supervisorId,
          page,
          pageSize,
        );

      if (!data || data.length === 0) {
        return {
          data: [],
          page,
          pageSize,
          total: 0,
        };
      }

      // Filter data jika searchQuery ada
      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nasabah_nama
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
        : data;

      const formattedData = filteredData.map((item) => {
        const nominal = Number(item.nominal_pinjaman);
        const formattedNominal = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(nominal);

        return {
          id_pengajuan: Number(item.loan_id),
          id_nasabah: Number(item.nasabah_id),
          nama_nasabah: item.nasabah_nama,
          nominal_pinjaman: formattedNominal,
          id_marketing: Number(item.user_id),
          nama_marketing: item.marketing_nama,
          status: item.loan_status,
        };
      });

      return {
        data: formattedData,
        page,
        pageSize,
        total: searchQuery ? filteredData.length : totalFromSP,
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
