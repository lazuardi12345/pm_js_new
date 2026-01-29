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
export class HM_GetAllApprovalRequestInternalUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
  ) {}

  async execute(hmId: number, page = 1, pageSize = 10, searchQuery = '') {
    try {
      console.log('WUseCase Request:', { hmId, page, pageSize, searchQuery });

      // Step 1: Ambil semua data tanpa pagination
      const { data } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalRequest_Internal(
          hmId,
          1,
          500, // Ambil semua data
        );

      if (!data || data.length === 0) {
        return { data: [], total: 0, page, pageSize };
      }

      // Step 2: Filter jika ada search query
      const trimmedQuery = searchQuery.trim().toLowerCase();
      const filteredData = trimmedQuery
        ? data.filter((item) =>
            item.nasabah_nama?.toLowerCase().includes(trimmedQuery),
          )
        : data;

      // Step 3: Pagination manual
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      // Step 4: Format data
      // Step 4: Format data dengan approval recommendation
      const formattedData = await Promise.all(
        paginatedData.map(async (item) => {
          const nominal = Number(item.nominal_pinjaman) || 0;

          // Fetch approval recommendation
          let approval_recommendation: any = null;
          const draftId = item.draft_id ?? null;

          if (draftId) {
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
            waktu_pengajuan: item.waktu_pengajuan || '-',
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
        total: filteredData.length,
        page,
        pageSize,
      };
    } catch (err) {
      console.error('*! Error di UseCase HM_GetAllApprovalRequest:', err);
      throw new Error(err.message || 'Gagal mengambil data pengajuan untuk HM');
    }
  }
}
