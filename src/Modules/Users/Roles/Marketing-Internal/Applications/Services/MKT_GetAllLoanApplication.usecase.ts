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
    // Ambil data dan total dari SP
    const { data, total } = await this.loanAppRepo.callSP_MKT_GetAllLoanApplications_Internal(
      marketingId,
      page,
      pageSize,
    );

    const trimmedQuery = searchQuery.trim().toLowerCase();

    // Filter data sesuai searchQuery (case insensitive)
    const filteredData = trimmedQuery
      ? data.filter((item) =>
          item.nama_lengkap?.toLowerCase().includes(trimmedQuery),
        )
      : data;

    // Format data sesuai kebutuhan output
    const formattedData = filteredData.map((item) => ({
      clientId: Number(item.clientId),
      loanAppId: Number(item.loanAppId),
      nominal_pinjaman: Number(item.nominal_pinjaman),
      tenor: Number(item.tenor),
      nama_lengkap: item.nama_lengkap,
      status: item.status,
    }));

    // Return dengan payload standar
    return {
      payload: {
        error: false,
        message: 'Get Loan Applications successfully retrieved',
        reference: 'LOAN_RETRIEVE_OK',
        data: {
          results: formattedData,
          page,
          pageSize,
          total: total.toString(),
        },
      },
    };
  } catch (err) {
    throw new Error(err.message || 'Gagal mengambil data pengajuan');
  }
}
}
