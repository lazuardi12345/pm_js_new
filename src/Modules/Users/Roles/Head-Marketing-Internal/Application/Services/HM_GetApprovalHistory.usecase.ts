import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetAllApprovalHistoryUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    hmId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      const { data, total } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalHistory_Internal(
          hmId,
          page,
          pageSize,
        );

      const trimmedQuery = searchQuery.trim().toLowerCase();

      // Filter data jika ada search query
      const filteredData = trimmedQuery.length > 0
        ? data.filter(item =>
            (item.nama_lengkap?.toLowerCase().includes(trimmedQuery)) ||
            (item.nama_marketing?.toLowerCase().includes(trimmedQuery)) ||
            (item.status?.toLowerCase().includes(trimmedQuery))
          )
        : data;

      // Format data
      const formattedData = filteredData.map(item => ({
        id_pengajuan: Number(item.id_pengajuan),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nama_lengkap || '-',
        nominal_pinjaman: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item.nominal_pinjaman)),
        nama_marketing: item.nama_marketing || '-',
        nama_supervisor: item.nama_supervisor || '-',
        status: item.status || '-',
      }));

      return {
        data: formattedData,
        total, // total dari SP (tanpa filtering untuk konsistensi pagination)
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data history approval');
    }
  }
}
