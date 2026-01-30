// src/Modules/LoanAppExternal/Application/UseCases/AdCont_GetAllLoanDataExternal_UseCase.ts
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
            reference: 'LOAN_DATA_EXTERNAL_EMPTY',
            data: [],
            total: 0,
            page,
            pageSize,
          },
        };
      }

      const total = Number(result[0]?.[0]?.total_count || 0);
      const rawData = result[1] || [];

      // Map data sesuai format yang diminta
      const mappedData = await Promise.all(
        rawData.map(async (item: any) => {
          try {
            return {
              loan_id: Number(item?.loan_id ?? 0),
              nama_nasabah: item?.nama_nasabah ?? '-',
              loan_amount: this.formatCurrency(item?.loan_amount),
              loan_tenor: item?.loan_tenor ?? '-',
              loan_sequence: Number(item?.loan_sequence ?? 0),
              loan_submitted_at: item?.loan_submitted_at ?? '-',
              marketing_name: item?.marketing_name ?? '-',
              credit_analyst_name: item?.ca_app_name ?? '-',
              marketing_notes: item?.notes ?? '-',
              company_name: item?.company_name ?? '-',
              job_grade: item?.job_grade ?? '-',

              loan_application_status: {
                spv: {
                  data: {
                    spv_name: item?.spv_app_name ?? '-',
                    spv_response: item?.spv_app_status ?? '-',
                    spv_conclusion: item?.spv_app_conclusion ?? '-',
                  },
                },
                ca: {
                  data: {
                    ca_name: item?.ca_app_name ?? '-',
                    ca_response: item?.ca_app_status ?? '-',
                    ca_conclusion: item?.ca_app_conclusion ?? '-',
                  },
                },
                hm: {
                  data: {
                    hm_name: item?.hm_app_name ?? '-',
                    hm_response: item?.hm_app_status ?? '-',
                    hm_conclusion: item?.hm_app_conclusion ?? '-',
                  },
                },
              },

              loan_appeal_status: {
                ca: {
                  data: {
                    ca_name: item?.ca_appeal_name ?? null,
                    ca_response: item?.ca_appeal_status ?? null,
                    ca_conclusion: item?.ca_appeal_conclusion ?? null,
                  },
                },
                hm: {
                  data: {
                    hm_name: item?.hm_appeal_name ?? null,
                    hm_response: item?.hm_appeal_status ?? null,
                    hm_conclusion: item?.hm_appeal_conclusion ?? null,
                  },
                },
              },
            };
          } catch (itemErr) {
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
          message: 'Loan data retrieved successfully',
          reference: 'LOAN_DATA_EXTERNAL_OK',
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
          message: err.message || 'Failed to get loan data',
          reference: 'LOAN_DATA_EXTERNAL_ERROR',
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
}
