import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class SPV_GetAllApproval_ByTeam_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

async execute(
  supervisorId: number,
  page = 1,
  pageSize = 10,
  searchQuery = '',
) {
  try {
    console.log(
      'SPV ID:',
      supervisorId,
      'Page:',
      page,
      'PageSize:',
      pageSize,
      'Search:',
      searchQuery,
    );

    // STEP 1: Ambil semua data tanpa pagination dari stored procedure
    const { data } = await this.loanAppRepo.callSP_SPV_GetAllApprovalHistory_ByTeam(
      supervisorId,
      1,
      500, // Ambil semua data, pagination dilakukan di sini
    );

    if (!data || data.length === 0) {
      return {
        data: [],
        page,
        pageSize,
        total: 0,
      };
    }

    // STEP 2: Filter data berdasarkan searchQuery
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const filteredData = trimmedQuery
      ? data.filter((item) =>
          item.nasabah_nama?.toLowerCase().includes(trimmedQuery),
        )
      : data;

    // STEP 3: Manual Pagination setelah filter
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    // STEP 4: Format hasil
    const formattedData = paginatedData.map((item) => {
      const nominal = Number(item.nominal_pinjaman);
      const formattedNominal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(nominal);

      return {
        id_pengajuan: Number(item.loan_id),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nasabah_nama,
        nominal_pinjaman: formattedNominal,
        id_marketing: Number(item.user_id),
        nama_marketing: item.marketing_nama,
        status: item.loan_status,
      };
    });

    return {
      data: formattedData,
      page,
      pageSize,
      total: filteredData.length, // Total hasil setelah filter
    };
  } catch (err) {
    throw new Error(err.message || 'Gagal mengambil data pengajuan');
  }
}

}
