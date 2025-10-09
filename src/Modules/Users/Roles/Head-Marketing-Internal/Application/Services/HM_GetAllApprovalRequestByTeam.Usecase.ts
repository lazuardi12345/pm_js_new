import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetAllApprovalRequestByTeam_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    hmId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      console.log(
        'HM ID: ',
        hmId,
        'page: ',
        page,
        'pageSize: ',
        pageSize,
      );

      // 🔹 Panggil Stored Procedure khusus HM
      const { data, total } =
        await this.loanAppRepo.callSP_CA_GetAllApprovalRequest_Internal(
          hmId,
          page,
        );

      if (!data || data.length === 0) {
        throw new Error('Data pengajuan tidak ditemukan');
      }

      // 🔍 Filter berdasarkan searchQuery
      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nasabah_nama
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
        : data;

      // 💰 Format nominal pinjaman
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

      return { data: formattedData, total };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan untuk HM');
    }
  }
}
