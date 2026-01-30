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
export class CA_GetApprovalHistory_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
  ) {}

  async execute(creditAnalystId, page = 1, pageSize = 10, searchQuery = '') {
    try {
      // Step 1: Ambil semua data tanpa pagination
      const result =
        await this.loanAppRepo.callSP_CA_GetApprovalHistory_Internal(
          creditAnalystId,
          1,
          500, // Ambil semua data
        );

      const data = result.data ?? [];

      // Step 2: Filter berdasarkan searchQuery
      const trimmedQuery = searchQuery.trim().toLowerCase();

      const filteredData =
        trimmedQuery.length > 0
          ? data.filter(
              (item) =>
                item.nama_lengkap?.toLowerCase().includes(trimmedQuery) ||
                item.nama_marketing?.toLowerCase().includes(trimmedQuery) ||
                item.nama_supervisor?.toLowerCase().includes(trimmedQuery),
            )
          : data;

      // Step 3: Manual pagination
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      // Step 4: Format data
      const formattedData = await Promise.all(
        paginatedData.map(async (item) => {
          const nominal = Number(item.nominal_pinjaman);
          const isLowAmount = Number.isFinite(nominal) && nominal < 7_000_000;

          const formattedNominal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(Number.isFinite(nominal) ? nominal : 0);

          // -------------------------
          // Approval Recommendation Logic
          // -------------------------
          let approval_recommendation: any = null;
          const draftId = item?.draft_id ?? null;

          //LOW AMOUNT → wajib dont_have_check
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
                    approvalData.nama_nasabah ?? item.nasabah_nama ?? '-',
                  recommendation: approvalData.recommendation ?? null,
                  filePath: approvalData.filePath ?? null,
                  catatan: approvalData.catatan ?? null,
                  last_updated: approvalData.updated_at ?? null,
                  isNeedCheck: !!item.isNeedCheck,
                };
              } else {
                // draft ada tapi BI belum input
                approval_recommendation = {
                  draft_id: draftId,
                  recommendation: null,
                  isNeedCheck: !!item.isNeedCheck,
                };
              }
            } catch (approvalErr) {
              console.error(
                `Warning: failed to fetch approval recommendation for draft_id=${draftId}`,
                approvalErr,
              );
            }
          }

          // -------------------------
          // Response Mapping
          // -------------------------
          return {
            id_pengajuan: Number(item.loan_id),
            id_nasabah: Number(item.nasabah_id),
            nama_nasabah: item.nama_lengkap || '-',
            nominal_pinjaman: formattedNominal,
            id_marketing: item.id_marketing ? Number(item.id_marketing) : null,
            nama_marketing: item.nama_marketing || null,
            nama_supervisor: item.nama_supervisor || null,
            payment_type: item.jenis_pembiayaan || null,
            approval_status: item.approval_status || '-',
            loan_status: item.loan_status || '-',
            loan_submitted_at: item?.loan_submitted_at ?? '-',
            approve_response_date: item.approval_date || '-',
            is_it_appeal: item.is_banding ? item.is_banding : 0,
            is_need_survey: Number(item.is_need_survey!),
            approval_recommendation,
          };
        }),
      );

      return {
        payload: {
          error: false,
          message: 'Get Loan Application History successfully retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: {
            results: formattedData,
            page,
            pageSize,
            total: filteredData.length.toString(), // Total setelah filter
          },
        },
      };
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Gagal mengambil data pengajuan',
      );
    }
  }
}
