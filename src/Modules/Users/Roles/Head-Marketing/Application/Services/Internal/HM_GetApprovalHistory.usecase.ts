import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetAllApprovalHistoryInternalUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(hmId: number, page = 1, pageSize = 10, searchQuery = '') {
    try {
      const { data, total } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalHistory_Internal(
          hmId,
          page,
          pageSize,
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
        loan_amount: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item!.loan_amount)),
        loan_sequence: item.pinjaman_ke || '-',
        tenor: item.tenor || '-',
        approval_request_submitted_at:
          item.approval_request_submitted_at || '-',
        approval_request_latest_responded_at:
          item.approval_request_responded_at || '-',
        latest_loan_app_status: item.latest_loan_app_status || '-',
        loan_submitted_at: item.approval_request_submitted_at || '-',
        marketing_name: item.marketing_name || '-',

        loan_application_status: {
          spv: {
            data: {
              spv_name: item.spv_app_name || '-',
              spv_response: item.spv_app_status || '-',
              spv_approved_amount: item.spv_app_approved_amount || '-',
              spv_approved_tenor: item.spv_app_approved_tenor || '-',
              spv_response_at: item.spv_app_response_at || '-',
            },
          },
          ca: {
            data: {
              ca_name: item.ca_app_name || '-',
              ca_response: item.ca_app_status || '-',
              ca_approved_amount: item.ca_app_approved_amount || '-',
              ca_approved_tenor: item.ca_app_approved_tenor || '-',
              ca_response_at: item.ca_app_response_at || '-',
            },
          },
          hm: {
            data: {
              hm_name: item.hm_app_name || '-',
              hm_response: item.hm_app_status || '-',
              hm_approved_amount: item.hm_app_approved_amount || '-',
              hm_approved_tenor: item.hm_app_approved_tenor || '-',
              hm_response_at: item.hm_app_response_at || '-',
            },
          },
        },
        loan_appeal_status: {
          ca: {
            data: {
              ca_name: item.ca_appeal_name || '-',
              ca_response: item.ca_appeal_status || '-',
              ca_approved_amount: item.ca_appeal_approved_amount || '-',
              ca_approved_tenor: item.ca_appeal_approved_tenor || '-',
              ca_response_at: item.ca_appeal_response_at || '-',
            },
          },
          hm: {
            data: {
              hm_name: item.hm_appeal_name || '-',
              hm_response: item.hm_appeal_status || '-',
              hm_approved_amount: item.hm_appeal_approved_amount || '-',
              hm_approved_tenor: item.hm_appeal_approved_tenor || '-',
              hm_response_at: item.hm_appeal_response_at || '-',
            },
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
