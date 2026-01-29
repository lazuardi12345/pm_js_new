// src/Modules/LoanAppInternal/Application/mkt-get-all-loan-application.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';

@Injectable()
export class SPV_GetAllApprovalRequestByTeam_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
  ) {}

  async execute(
    supervisorId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      console.log('SPV:', supervisorId, 'Page:', page, 'PageSize:', pageSize);

      // Step 1: Ambil semua data (tanpa pagination)
      const { data } =
        await this.loanAppRepo.callSP_SPV_GetAllApprovalRequest_Internal(
          supervisorId,
          1,
          500, // Ambil semua data
        );

      if (!data || data.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
        };
      }

      // Step 2: Lakukan filtering berdasarkan searchQuery
      const trimmedQuery = searchQuery.trim().toLowerCase();

      const filteredData = trimmedQuery
        ? data.filter((item) =>
            item.nasabah_nama?.toLowerCase().includes(trimmedQuery),
          )
        : data;

      // Step 3: Pagination manual setelah filter
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      // Step 4: Format hasil dengan approval recommendation
      const formattedData = await Promise.all(
        paginatedData.map(async (item) => {
          const nominal = Number(item.nominal_pinjaman);
          const formattedNominal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(nominal);

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
            // Tidak ada draft_id, tapi nominal < 7jt
            approval_recommendation = {
              dont_have_check: true,
            };
          }

          return {
            id_pengajuan: Number(item.loan_id),
            id_nasabah: Number(item.nasabah_id),
            nama_nasabah: item.nasabah_nama,
            tipe_nasabah: item.tipe_nasabah,
            nominal_pinjaman: formattedNominal,
            id_marketing: item.user_id ? Number(item.user_id) : null,
            nama_marketing: item.marketing_nama || null,
            status: item.loan_status,
            approval_recommendation, // Tambahkan ini
          };
        }),
      );

      return {
        data: formattedData,
        total: filteredData.length,
        page,
        pageSize,
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
