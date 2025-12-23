// src/Modules/LoanAppInternal/Application/UseCases/AdCont_GetAllLoanDataInternal_UseCase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class AdCont_GetAllLoanDataInternalUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(page: number, pageSize: number) {
    try {
      const result =
        await this.loanAppRepo.callSP_AdCont_GetAllLoanData_Internal(
          page,
          pageSize,
        );

      if (!result || result.length < 2) {
        return {
          payload: {
            success: true,
            message: 'No data found',
            reference: 'LOAN_DATA_INTERNAL_EMPTY',
            data: [],
            total: 0,
            page,
            pageSize,
          },
        };
      }

      const total = result[0]?.[0]?.total_count || 0;
      const rawData = result[1] || [];
      const total_pages = Math.ceil(total / pageSize);

      // Map data sesuai format yang diminta
      const mappedData = await Promise.all(
        rawData.map(async (item: any) => {
          try {
            // Format currency
            const loanAmountFormatted = this.formatCurrency(item?.loan_amount);
            const lastApprovedAmountFormatted = this.formatCurrency(
              item?.last_approval_amount,
            );
            const riwayatNominalFormatted = this.formatCurrency(
              item?.riwayat_nominal,
            );
            const sisaPinjamanFormatted = this.formatCurrency(
              item?.sisa_pinjaman,
            );

            // Build approval recommendation
            const approval_recommendation =
              this.buildApprovalRecommendation(item);

            // Build safe object with defaults
            return {
              loan_id: Number(item?.loan_id ?? 0),
              customer_id: Number(item?.customer_id ?? 0),
              customer_name: item?.customer_name ?? '-',
              // Data pekerjaan
              job_info: {
                perusahaan: item?.perusahaan ?? '-',
                divisi: item?.divisi ?? '-',
                golongan: item?.golongan ?? '-',
                yayasan: item?.yayasan ?? '-',
              },

              // Data pinjaman umum
              loan_amount: loanAmountFormatted,
              loan_sequence: item?.pinjaman_ke ?? '-',
              tenor: item?.tenor ?? '-',
              loan_submitted_at: this.formatDate(item?.loan_submitted_at),
              latest_loan_status: item?.latest_loan_status ?? '-',
              final_loan_status: item?.final_loan_status ?? '-',
              marketing_name: item?.marketing_name ?? '-',
              marketing_registered_at: this.formatDate(
                item?.marketing_registered_at,
              ),
              approval_recommendation,

              // Status pengajuan awal
              loan_application_status: {
                ca: {
                  ca_name: item?.ca_app_name ?? '-',
                  ca_response: item?.ca_app_status ?? '-',
                  ca_appr_amount: this.formatCurrency(item?.ca_app_amount),
                  ca_appr_tenor: item?.ca_app_tenor ?? '-',
                  ca_response_at: this.formatDate(item?.ca_app_response_at),
                },
                spv: {
                  spv_name: item?.spv_app_name ?? '-',
                  spv_response: item?.spv_app_status ?? '-',
                  spv_appr_amount: this.formatCurrency(item?.spv_app_amount),
                  spv_appr_tenor: item?.spv_app_tenor ?? '-',
                  spv_response_at: this.formatDate(item?.spv_app_response_at),
                },
                hm: {
                  hm_name: item?.hm_app_name ?? '-',
                  hm_response: item?.hm_app_status ?? '-',
                  hm_appr_amount: this.formatCurrency(item?.hm_app_amount),
                  hm_appr_tenor: item?.hm_app_tenor ?? '-',
                  hm_response_at: this.formatDate(item?.hm_app_response_at),
                },
              },

              // Status banding
              loan_appeal_status: {
                ca: {
                  ca_name: item?.ca_appeal_name ?? '-',
                  ca_response: item?.ca_appeal_status ?? '-',
                  ca_appr_amount: this.formatCurrency(item?.ca_appeal_amount),
                  ca_appr_tenor: item?.ca_appeal_tenor ?? '-',
                  ca_response_at: this.formatDate(item?.ca_appeal_response_at),
                },
                spv: {
                  spv_name: item?.spv_appeal_name ?? '-',
                  spv_response: item?.spv_appeal_status ?? '-',
                  spv_appr_amount: this.formatCurrency(item?.spv_appeal_amount),
                  spv_appr_tenor: item?.spv_appeal_tenor ?? '-',
                  spv_response_at: this.formatDate(
                    item?.spv_appeal_response_at,
                  ),
                },
                hm: {
                  hm_name: item?.hm_appeal_name ?? '-',
                  hm_response: item?.hm_appeal_status ?? '-',
                  hm_appr_amount: this.formatCurrency(item?.hm_appeal_amount),
                  hm_appr_tenor: item?.hm_appeal_tenor ?? '-',
                  hm_response_at: this.formatDate(item?.hm_appeal_response_at),
                },
              },

              // Last approval info
              last_approved_amount: lastApprovedAmountFormatted,
              last_approved_tenor: Number(item?.last_approval_tenor ?? 0),
              last_approval_role: item?.last_approval_role ?? '-',
            };
          } catch (itemErr) {
            console.error('Error processing single loan item:', itemErr);
            return {
              error: true,
              message: 'Failed to process this loan item',
              reference: 'LOAN_ITEM_PROCESSING_ERROR',
              rawItem: item ?? null,
            };
          }
        }),
      );

      return {
        payload: {
          success: true,
          message: 'Internal loan list retrieved successfully',
          reference: 'LOAN_DATA_INTERNAL_OK',
          data: mappedData,
          total,
          page,
          pageSize,
        },
      };
    } catch (err) {
      return {
        payload: {
          success: false,
          message: err.message || 'Failed to get internal loan list',
          reference: 'LOAN_DATA_INTERNAL_ERROR',
        },
      };
    }
  }

  private formatCurrency(amount: number | string | null): string {
    if (!amount || amount === 0) return 'Rp. 0';

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Rp. ${numAmount.toLocaleString('id-ID')}`;
  }

  private formatDate(date: string | Date | null): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }

  //   private formatWorkDuration(
  //     years: number | null,
  //     months: number | null,
  //   ): string {
  //     const y = years ?? 0;
  //     const m = months ?? 0;

  //     if (y === 0 && m === 0) return '-';

  //     const parts = [];
  //     if (y > 0) parts.push(`${y} tahun`);
  //     if (m > 0) parts.push(`${m} bulan`);

  //     return parts.join(' ');
  //   }

  private buildApprovalRecommendation(item: any): string {
    // Logic untuk menentukan approval recommendation
    // Prioritas: Appeal > Application
    if (item?.hm_appeal_status === 'approved') {
      return 'Approved by HM (Appeal)';
    }
    if (item?.spv_appeal_status === 'approved') {
      return 'Approved by SPV (Appeal)';
    }
    if (item?.ca_appeal_status === 'approved') {
      return 'Approved by CA (Appeal)';
    }
    if (item?.hm_app_status === 'approved') {
      return 'Approved by HM';
    }
    if (item?.spv_app_status === 'approved') {
      return 'Approved by SPV';
    }
    if (item?.ca_app_status === 'approved') {
      return 'Approved by CA';
    }

    // Check rejection
    if (item?.hm_appeal_status === 'rejected') {
      return 'Rejected by HM (Appeal)';
    }
    if (item?.spv_appeal_status === 'rejected') {
      return 'Rejected by SPV (Appeal)';
    }
    if (item?.ca_appeal_status === 'rejected') {
      return 'Rejected by CA (Appeal)';
    }
    if (item?.hm_app_status === 'rejected') {
      return 'Rejected by HM';
    }
    if (item?.spv_app_status === 'rejected') {
      return 'Rejected by SPV';
    }
    if (item?.ca_app_status === 'rejected') {
      return 'Rejected by CA';
    }

    return 'Pending Review';
  }
}
