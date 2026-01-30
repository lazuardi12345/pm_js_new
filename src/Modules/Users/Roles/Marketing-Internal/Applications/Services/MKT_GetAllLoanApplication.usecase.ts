import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY,
  ILoanApplicationDraftInternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/int/LoanAppInt.repository';

@Injectable()
export class MKT_GetAllLoanApplicationUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
  ) {}

  async execute(marketingId: number, page = 1, pageSize = 10) {
    try {
      // -------------------------
      // 1) VALIDASI INPUT
      // -------------------------
      if (
        marketingId === null ||
        marketingId === undefined ||
        Number.isNaN(Number(marketingId))
      ) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Invalid marketingId',
              reference: 'INVALID_MARKETING_ID',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      page = Number(page) || 1;
      pageSize = Number(pageSize) || 10;
      if (page < 1) page = 1;
      if (pageSize < 1) pageSize = 10;

      // -------------------------
      // 2) Ambil data dari SP / Repo
      // -------------------------
      let spResult;
      try {
        spResult =
          await this.loanAppRepo.callSP_MKT_GetAllLoanApplications_Internal(
            marketingId,
            page,
            pageSize,
          );
        console.log('catch SP RES: ', spResult);
      } catch (repoErr) {
        console.error('Error calling Stored Procedure:', repoErr);

        if (
          repoErr?.name === 'MongoNetworkError' ||
          repoErr?.code === 'ECONNREFUSED'
        ) {
          throw new HttpException(
            {
              payload: {
                error: true,
                message:
                  'Database connection error while retrieving loan applications',
                reference: 'DB_CONNECTION_ERROR',
              },
            },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Failed to query loan applications',
              reference: 'LOANAPP_SP_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const dataArray: any[] = Array.isArray(spResult?.data)
        ? spResult.data
        : [];
      const total: number = Number(spResult?.total ?? 0);

      // -------------------------
      // 3) Helper: safe formatting
      // -------------------------
      const formatCurrency = (value: number) => {
        try {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(value);
        } catch (e) {
          return String(value ?? 0);
        }
      };

      // -------------------------
      // 4) Process items (defensive per-item)
      // -------------------------
      const formattedData = await Promise.all(
        dataArray.map(async (item: any) => {
          try {
            const nominalPinjaman = Number(item?.loan_amount ?? 0);
            const isLowAmount =
              Number.isFinite(nominalPinjaman) && nominalPinjaman < 7_000_000;

            const draftId = item?.draft_id ?? null;

            // -------------------------
            // Approval Recommendation Logic
            // -------------------------
            let approval_recommendation: any = null;

            // LOW AMOUNT → wajib dont_have_check
            if (isLowAmount) {
              approval_recommendation = {
                dont_have_check: true,
              };
            }

            // HIGH AMOUNT → BI checking flow
            else if (draftId) {
              try {
                const approvalData =
                  await this.approvalRecomRepo.findByDraftId(draftId);

                if (approvalData) {
                  approval_recommendation = {
                    draft_id: approvalData.draft_id ?? draftId,
                    nama_nasabah:
                      approvalData.nama_nasabah ?? item.customer_name ?? '-',
                    recommendation: approvalData.recommendation ?? null,
                    filePath: approvalData.filePath ?? null,
                    catatan: approvalData.catatan ?? null,
                    last_updated: approvalData.updated_at ?? null,
                    isNeedCheck: !!item?.isNeedCheck,
                  };
                } else {
                  // draft ada tapi BI belum input
                  approval_recommendation = {
                    draft_id: draftId,
                    recommendation: null,
                    isNeedCheck: !!item?.isNeedCheck,
                  };
                }
              } catch (approvalErr) {
                console.error(
                  `Warning: failed to fetch approval recommendation for draft_id=${draftId}`,
                  approvalErr,
                );
                approval_recommendation = {
                  error: true,
                  message: 'Failed to fetch approval recommendation',
                  reference: 'RECOMMENDATION_FETCH_FAILED',
                };
              }
            }

            // -------------------------
            // Formatting
            // -------------------------
            const loanAmountFormatted = formatCurrency(
              Number.isFinite(nominalPinjaman) ? nominalPinjaman : 0,
            );

            const lastApprovedAmount = Number(item?.last_approval_nominal);
            const lastApprovedAmountFormatted = formatCurrency(
              Number.isFinite(lastApprovedAmount) ? lastApprovedAmount : 0,
            );

            // -------------------------
            // Response Mapping
            // -------------------------
            return {
              loan_id: Number(item?.loan_id ?? 0),
              customer_id: Number(item?.customer_id ?? 0),
              customer_name: item?.customer_name ?? '-',
              customer_type: item?.customer_type ?? '-',
              loan_amount: loanAmountFormatted,
              loan_sequence: item?.pinjaman_ke ?? '-',
              tenor: item?.tenor ?? '-',
              loan_submitted_at: item?.loan_submitted_at ?? '-',
              latest_loan_status: item?.latest_loan_status ?? '-',
              final_loan_status: item?.final_loan_status ?? '-',
              marketing_name: item?.marketing_name ?? '-',
              approval_recommendation,
              loan_application_status: {
                spv: {
                  data: {
                    spv_name: item?.spv_app_name ?? '-',
                    spv_response: item?.spv_app_status ?? '-',
                    spv_approved_amount: item?.spv_app_amount ?? '-',
                    spv_approved_tenor: item?.spv_app_tenor ?? '-',
                    spv_response_at: item?.spv_app_response_at ?? '-',
                  },
                },
                svy: {
                  data: {
                    svy_visited_person: item?.survey_berjumpa_siapa ?? '-',
                    svy_visited_time: item?.survey_created_at ?? '-',
                  },
                },
                ca: {
                  data: {
                    ca_name: item?.ca_app_name ?? '-',
                    ca_response: item?.ca_app_status ?? '-',
                    ca_approved_amount: item?.ca_app_amount ?? '-',
                    ca_approved_tenor: item?.ca_app_tenor ?? '-',
                    ca_response_at: item?.ca_app_response_at ?? '-',
                  },
                },
                hm: {
                  data: {
                    hm_name: item?.hm_app_name ?? '-',
                    hm_response: item?.hm_app_status ?? '-',
                    hm_approved_amount: item?.hm_app_amount ?? '-',
                    hm_approved_tenor: item?.hm_app_tenor ?? '-',
                    hm_response_at: item?.hm_app_response_at ?? '-',
                  },
                },
              },
              loan_appeal_status: {
                hm: {
                  data: {
                    hm_name: item?.hm_appeal_name ?? '-',
                    hm_response: item?.hm_appeal_status ?? '-',
                    ca_approved_amount: item?.hm_appeal_amount ?? '-',
                    ca_approved_tenor: item?.hm_appeal_tenor ?? '-',
                    hm_response_at: item?.hm_appeal_response_at ?? '-',
                  },
                },
              },
              last_approved_amount: lastApprovedAmountFormatted,
              last_approved_tenor: Number(item?.last_approval_tenor),
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

      // -------------------------
      // 5) RETURN SUCCESS
      // -------------------------
      return { data: formattedData, total };
    } catch (err) {
      console.error('=== ERROR execute (GetAllLoanApplications) ===');
      console.error(err);

      // Already HttpException => forward (ke konsistensi payload global)
      if (err instanceof HttpException) {
        throw err;
      }

      // DB network error
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

      // Cast / invalid param types
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

      // Fallback
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err?.message || 'Gagal mengambil data history approval',
            reference: 'LOAN_HISTORY_FETCH_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
