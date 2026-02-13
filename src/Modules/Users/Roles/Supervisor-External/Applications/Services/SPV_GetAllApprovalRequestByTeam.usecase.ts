// src/Modules/LoanAppInternal/Application/mkt-get-all-loan-application.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class SPV_GetAllApprovalRequestByTeam_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
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
        await this.loanAppRepo.callSP_SPV_GetAllApprovalRequest_External(
          supervisorId,
          1,
          500,
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

          // Fetch approval recommendation langsung pakai draft_id
          let approval_recommendation: any = null;

          console.log(item);

          if (item.draft_id) {
            try {
              const approvalData = await this.approvalRecomRepo.findByDraftId(
                item.draft_id,
              );

              console.log(
                'Approval Data for draft_id:',
                item.draft_id,
                approvalData,
              );

              if (approvalData) {
                approval_recommendation = {
                  draft_id: approvalData.draft_id ?? item.draft_id,
                  nama_nasabah:
                    approvalData.nama_nasabah ?? item.nasabah_nama ?? '-',
                  recommendation: approvalData.recommendation ?? null,
                  filePath: approvalData.filePath ?? null,
                  catatan: approvalData.catatan ?? null,
                  last_updated: approvalData.updated_at ?? null,
                  isNeedCheck: !!item.isNeedCheck,
                };
              }
            } catch (approvalErr) {
              console.error(
                `Warning: failed to fetch approval recommendation for draft_id=${item.draft_id}`,
                approvalErr,
              );
              approval_recommendation = {
                error: true,
                message: 'Failed to fetch approval recommendation',
                reference: 'RECOMMENDATION_FETCH_FAILED',
              };
            }
          }

          return {
            id_pengajuan: Number(item.loan_id),
            nama_nasabah: item.nasabah_nama,
            tipe_nasabah: 'reguler',
            nominal_pinjaman: item.nominal_pinjaman || '-',
            jenis_pembiayaan: item.jenis_pembiayaan || null,
            nama_marketing: item.marketing_nama || null,
            status: item.loan_status,
            loan_submitted_at: item?.loan_submitted_at ?? '-',
            approval_recommendation, // Tambahkan approval recommendation
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
