// src/Modules/LoanAppInternal/Application/mkt-get-all-loan-application.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class SPV_GetAllApprovalRequestByTeam_UseCase {
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
    console.log('SPV:', supervisorId, 'Page:', page, 'PageSize:', pageSize);

    // Step 1: Ambil semua data (tanpa pagination)
    const { data } = await this.loanAppRepo.callSP_SPV_GetAllApprovalRequest_Internal(
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
          item.nasabah_nama?.toLowerCase().includes(trimmedQuery)
        )
      : data;

    // Step 3: Pagination manual setelah filter
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    // Step 4: Format hasil
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
        id_marketing: item.user_id ? Number(item.user_id) : null,
        nama_marketing: item.marketing_nama || null,
        status: item.loan_status,
      };
    });

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
