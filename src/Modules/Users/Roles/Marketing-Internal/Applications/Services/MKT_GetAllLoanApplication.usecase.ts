import { Injectable, Inject } from '@nestjs/common';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY,
  ILoanApplicationDraftRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/LoanAppInt.repository';

@Injectable()
export class MKT_GetAllLoanApplicationUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
  ) {}

  async execute(marketingId: number, page = 1, pageSize = 10) {
    try {
      const { data, total } =
        await this.loanAppRepo.callSP_MKT_GetAllLoanApplications_Internal(
          marketingId,
          page,
          pageSize,
        );

      const formattedData = await Promise.all(
        data.map(async (item) => {
          const draftData = await this.loanAppDraftRepo.findStatus(item.no_ktp);
          console.log('tol', draftData);

          let approval_recommendation: any = null;

          if (draftData) {
            const approvalData = await this.approvalRecomRepo.findByDraftId(
              draftData.draft_id,
            );

            // Kasus: ada data rekomendasi (sudah di-check)
            if (approvalData) {
              approval_recommendation = {
                draft_id: approvalData.draft_id,
                nama_nasabah: approvalData.nama_nasabah,
                recommendation: approvalData.recommendation,
                filePath: approvalData.filePath,
                catatan: approvalData.catatan,
                last_updated: approvalData.updated_at,
                isNeedCheck: draftData.isNeedCheck,
              };

              // kalau nominal < 7jt, tambahkan flag "dont_have_check"
              if (approvalData.nominal_pinjaman < 7000000) {
                approval_recommendation.dont_have_check = true;
              }
            }
            //  Kasus: belum pernah di-check
            else {
              // cek dulu nominal di loanApp-nya (karena BI Check tidak diperlukan)
              if (Number(item.loan_amount) < 7000000) {
                approval_recommendation = {
                  draft_id: draftData.draft_id,
                  isNeedCheck: draftData.isNeedCheck,
                  dont_have_check: true, // tidak perlu BI check
                };
              } else {
                approval_recommendation = null; // belum di-check dan perlu BI check
              }
            }
          }

          // convert nominal pinjaman
          const loanAmount = Number(item.loan_amount || 0);

          return {
            loan_id: Number(item.loan_id),
            customer_id: Number(item.customer_id),
            customer_name: item.customer_name || '-',
            customer_type: item.customer_type || '-',
            loan_amount: new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(loanAmount),
            loan_sequence: item.pinjaman_ke || '-',
            tenor: item.tenor || '-',
            loan_submitted_at: item.loan_submitted_at || '-',
            latest_loan_status: item.latest_loan_status || '-',
            final_loan_status: item.final_loan_status || '-',
            marketing_name: item.marketing_name || '-',
            approval_recommendation,
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
          };
        }),
      );

      return { data: formattedData, total };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data history approval');
    }
  }
}
