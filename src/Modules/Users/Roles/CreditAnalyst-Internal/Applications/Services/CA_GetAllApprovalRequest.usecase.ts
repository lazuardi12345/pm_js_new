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
export class CA_GetAllApprovalRequest_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
  ) {}

  async execute(page = 1, pageSize = 10, searchQuery = '') {
    try {
      console.log(
        'page:',
        page,
        'pageSize:',
        pageSize,
        'searchQuery:',
        searchQuery,
      );

      // Step 1: Ambil semua data tanpa pagination dari SP
      const { data } =
        await this.loanAppRepo.callSP_CA_GetAllApprovalRequest_Internal(
          1,
          500, // Ambil semua data untuk kebutuhan search
        );

      if (!data || data.length === 0) {
        return {
          data: [],
          page,
          pageSize,
          total: 0,
        };
      }

      // Step 2: Filter jika ada search query
      const trimmedQuery = searchQuery.trim().toLowerCase();
      const filteredData = trimmedQuery
        ? data.filter((item) =>
            item.nama_nasabah?.toLowerCase().includes(trimmedQuery),
          )
        : data;

      // Step 3: Pagination manual
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      // Step 4: Format hasil
      const formattedData = await Promise.all(
        paginatedData.map(async (item) => {
          const nominal = Number(item.nominal_pinjaman);
          const isLowAmount = Number.isFinite(nominal) && nominal < 7_000_000;

          // Fetch approval recommendation
          let approval_recommendation: any = null;
          const draftId = item.draft_id ?? null;

          if (isLowAmount) {
            approval_recommendation = {
              dont_have_check: true,
            };
          } else if (draftId) {
            try {
              const approvalData =
                await this.approvalRecomRepo.findByDraftId(draftId);

              if (approvalData) {
                approval_recommendation = {
                  draft_id: approvalData.draft_id ?? draftId,
                  nama_nasabah:
                    approvalData.nama_nasabah ?? item.nama_nasabah ?? '-',
                  recommendation: approvalData.recommendation ?? null,
                  filePath: approvalData.filePath ?? null,
                  catatan: approvalData.catatan ?? null,
                  last_updated: approvalData.updated_at ?? null,
                  isNeedCheck: !!item.isNeedCheck,
                };
              } else {
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
          }

          return {
            pengajuan_id: item.pengajuan_id || null,
            id_nasabah: item.nasabah_id || null,
            nama_nasabah: item.nama_nasabah || '-',
            tipe_nasabah: item.tipe_nasabah || '-',
            pinjaman_ke: item.pinjaman_ke ?? 0,
            nominal_pinjaman: new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(nominal),
            tenor: item.tenor ? `${item.tenor} bulan` : '0 bulan',
            id_marketing: item.marketing_id || null,
            nama_marketing: item.nama_marketing || '-',
            nama_supervisor: item.nama_supervisor || '-',
            loan_submitted_at: item.waktu_pengajuan || '-',
            status_loan: item.status_loan || '-',
            perusahaan: item.perusahaan || '-',
            is_banding: !!item.is_banding,
            is_need_survey: Number(item.is_need_survey!),
            approval_recommendation, // Tambahkan ini
          };
        }),
      );

      return {
        data: formattedData,
        page,
        pageSize,
        total: filteredData.length, // total setelah filter
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
