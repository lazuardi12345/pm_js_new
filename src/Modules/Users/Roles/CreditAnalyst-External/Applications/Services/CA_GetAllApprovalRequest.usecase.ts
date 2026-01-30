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
export class CA_GetAllApprovalRequest_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
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
        await this.loanAppRepo.callSP_CA_GetAllApprovalRequest_External(
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
          const formattedNominal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(nominal);

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
            nama_nasabah: item.nama_nasabah,
            tipe_nasabah: 'reguler',
            jenis_pembiayaan: item.jenis_pembiayaan,
            nominal_pinjaman: formattedNominal,
            nama_marketing: item.nama_marketing,
            nama_supervisor: item.nama_supervisor,
            is_has_survey: Number(item.is_has_survey!),
            status: item.status_pengajuan,
            loan_submitted_at: item?.loan_submitted_at ?? '-',
            approval_recommendation, // Tambahkan approval recommendation
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
