import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class CA_GetApprovalHistory_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(creditAnalystId, page = 1, pageSize = 10, searchQuery = '') {
    try {
      // Step 1: Ambil semua data tanpa pagination
      const result =
        await this.loanAppRepo.callSP_CA_GetApprovalHistory_External(
          creditAnalystId,
          1,
          500, // Ambil semua data
        );

      console.log(result);

      const data = result.data ?? [];
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
      const formattedData = paginatedData.map((item) => ({
        id_pengajuan: Number(item.loan_id),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nama_lengkap || '-',
        nominal_pinjaman: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item.nominal_pinjaman)),
        id_marketing: item.id_marketing ? Number(item.id_marketing) : null,
        nama_marketing: item.nama_marketing || null,
        nama_supervisor: item.nama_supervisor || null,
        payment_type: item.jenis_pembiayaan || null,
        approval_status: item.approval_status || '-',
        loan_app_status: item.loan_status || '-',
        approve_response_date: item.approval_date || '-',
        is_it_appeal: item.is_banding ? item.is_banding : 0,
        is_need_survey: Number(item.is_need_survey!),
      }));

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
