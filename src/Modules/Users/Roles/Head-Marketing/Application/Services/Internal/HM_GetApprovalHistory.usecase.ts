import { Injectable, Inject } from '@nestjs/common';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetAllApprovalHistoryInternalUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
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
      const formattedData = await Promise.all(
        filteredData.map(async (item) => {
          const nominal = Number(item.loan_amount);
          // Fetch approval recommendation
          let approval_recommendation: any = null;
          const draftId = item.draft_id ?? null;
          const isLowAmount = !Number.isNaN(nominal) && nominal < 7000000;

          if (draftId) {
            try {
              const approvalData =
                await this.approvalRecomRepo.findByDraftId(draftId);

              if (approvalData) {
                const approvalNominal = Number(
                  approvalData.nominal_pinjaman ?? 0,
                );
                const approvalIsLowAmount =
                  !Number.isNaN(approvalNominal) && approvalNominal < 7000000;

                approval_recommendation = {
                  draft_id: approvalData.draft_id ?? draftId,
                  nama_nasabah:
                    approvalData.nama_nasabah ?? item.nasabah_nama ?? '-',
                  recommendation: approvalData.recommendation ?? null,
                  filePath: approvalData.filePath ?? null,
                  catatan: approvalData.catatan ?? null,
                  last_updated: approvalData.updated_at ?? null,
                  isNeedCheck: !!item.isNeedCheck,
                  dont_have_check: approvalIsLowAmount,
                };
              } else if (isLowAmount) {
                // Tidak ada approval data, tapi nominal < 7jt
                approval_recommendation = {
                  draft_id: draftId,
                  isNeedCheck: !!item.isNeedCheck,
                  dont_have_check: true,
                };
              } else {
                // Ada draft tapi belum ada approval, dan nominal >= 7jt
                approval_recommendation = {
                  draft_id: draftId,
                  isNeedCheck: !!item.isNeedCheck,
                  recommendation: null,
                };
              }
            } catch (approvalErr) {
              console.error(
                `Warning: failed to fetch approval recommendation for draft_id=${draftId}`,
                approvalErr,
              );
            }
          } else if (isLowAmount) {
            // Tidak ada draft_id, dan nominal < 7jt
            approval_recommendation = {
              dont_have_check: true,
            };
          }

          return {
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
            is_need_survey: Number(item.is_need_survey!),
            approval_recommendation, // Tambahkan ini

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
          };
        }),
      );

      return {
        data: formattedData,
        total, // total dari SP (tanpa filtering untuk konsistensi pagination)
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data history approval');
    }
  }
}
