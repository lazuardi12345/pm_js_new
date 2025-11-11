import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class MKT_GetAllLoanApplicationUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    marketingId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      // Step 1: Ambil semua data tanpa pagination
      const { data, total } =
        await this.loanAppRepo.callSP_MKT_GetAllLoanApplications_Internal(
          marketingId,
          page,
          pageSize, // Angka besar untuk ambil semua data
        );

      const trimmedQuery = searchQuery.trim().toLowerCase();

      // Filter data jika ada search query
      const filteredData =
        trimmedQuery.length > 0
          ? data.filter(
              (item) =>
                item.nama_lengkap?.toLowerCase().includes(trimmedQuery) ||
                item.nama_marketing?.toLowerCase().includes(trimmedQuery) ||
                item.status?.toLowerCase().includes(trimmedQuery),
            )
          : data;

      // Format data
      const formattedData = filteredData.map((item) => ({
        loan_id: Number(item.loan_id),
        customer_id: Number(item.customer_id),
        customer_name: item.customer_name || '-',
        customer_type: item.customer_type || '-',
        loan_amount: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item!.loan_amount)),
        loan_sequence: item.pinjaman_ke || '-',
        tenor: item.tenor || '-',
        loan_submitted_at: item.loan_submitted_at || '-',
        latest_loan_status: item.latest_loan_status || '-',
        marketing_name: item.marketing_name || '-',

        loan_application_status: {
          spv: {
            spv_name: item.spv_app_name || '-',
            spv_response: item.spv_app_status || '-',
            spv_response_at: item.spv_app_response_at || '-',
          },
          ca: {
            ca_name: item.ca_app_name || '-',
            ca_response: item.ca_app_status || '-',
            ca_response_at: item.ca_app_response_at || '-',
          },
          hm: {
            hm_name: item.hm_app_name || '-',
            hm_response: item.hm_app_status || '-',
            hm_response_at: item.hm_app_response_at || '-',
          },
        },
        loan_appeal_status: {
          ca: {
            ca_name: item.ca_appeal_name || '-',
            ca_response: item.ca_appeal_status || '-',
            ca_response_at: item.ca_appeal_response_at || '-',
          },
          hm: {
            hm_name: item.hm_appeal_name || '-',
            hm_response: item.hm_appeal_status || '-',
            hm_response_at: item.hm_appeal_response_at || '-',
          },
        },
      }));

      return {
        data: formattedData,
        total, // total dari SP (tanpa filtering untuk konsistensi pagination)
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data history approval');
    }
  }
}
