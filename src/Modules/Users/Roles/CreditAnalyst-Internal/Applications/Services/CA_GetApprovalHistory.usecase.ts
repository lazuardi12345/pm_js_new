import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class CA_GetApprovalHistory_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(page = 1, pageSize = 10, searchQuery = '') {
    try {
      const result =
        await this.loanAppRepo.callSP_CA_GetApprovalHistory_Internal(
          page,
          pageSize,
        );

      const data = result.data ?? [];
      const totalFromSP = result.total ?? 0;

      const trimmedQuery = searchQuery.trim().toLowerCase();

      const filteredData =
        trimmedQuery.length > 0
          ? data.filter((item) =>
              (item.nama_lengkap?.toLowerCase().includes(trimmedQuery)) ||
              (item.nama_marketing?.toLowerCase().includes(trimmedQuery)) ||
              (item.nama_supervisor?.toLowerCase().includes(trimmedQuery))
            )
          : data;

      const formattedData = filteredData.map((item) => ({
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
        status: item.loan_status,
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
            total: totalFromSP.toString(),
          },
        },
      };
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data pengajuan',
      );
    }
  }
}