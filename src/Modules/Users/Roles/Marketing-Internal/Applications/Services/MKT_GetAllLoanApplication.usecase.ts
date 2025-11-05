import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class MKT_GetAllLoanApplicationUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    marketingId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      // Step 1: Ambil semua data tanpa pagination
      const { data } =
        await this.loanAppRepo.callSP_MKT_GetAllLoanApplications_Internal(
          marketingId,
          1,
          500, // Angka besar untuk ambil semua data
        );

      const trimmedQuery = searchQuery.trim().toLowerCase();

      // Step 2: Filter berdasarkan searchQuery
      const filteredData = trimmedQuery
        ? data.filter(
            (item) =>
              item.nama_lengkap?.toLowerCase().includes(trimmedQuery) ||
              item.status?.toLowerCase().includes(trimmedQuery) ||
              item.status_akhir_pengajuan
                ?.toLowerCase()
                .includes(trimmedQuery) ||
              item.no_ktp?.toLowerCase().includes(trimmedQuery) ||
              item.email?.toLowerCase().includes(trimmedQuery),
          )
        : data;

      // Step 3: Apply manual pagination ke hasil filter
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      const formattedData = paginatedData.map((item) => ({
        clientId: Number(item.clientId),
        loanAppId: Number(item.loanAppId),
        nominal_pinjaman: Number(item.nominal_pinjaman),
        tenor: Number(item.tenor),
        nama_lengkap: item.nama_lengkap,
        status: item.status,
        status_akhir_pengajuan: item.status_akhir_pengajuan,
      }));

      return {
        payload: {
          error: false,
          message: 'Get Loan Applications successfully retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: {
            results: formattedData,
            page,
            pageSize,
            total: filteredData.length.toString(), // total hasil setelah filter
          },
        },
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
