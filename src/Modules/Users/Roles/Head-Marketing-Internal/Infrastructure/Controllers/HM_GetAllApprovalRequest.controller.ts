import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class HM_GetAllApprovalRequestUseCase {
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
      // Panggil stored procedure dari repository
      const { data, total } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalRequest_Internal(
          hmId,
          page,
          pageSize,
        );

      // Bersihkan dan kecilkan searchQuery agar pencarian konsisten
      const trimmedQuery = searchQuery.trim().toLowerCase();

      // Filter data berdasarkan searchQuery jika ada
      const filteredData = trimmedQuery.length > 0
        ? data.filter(item =>
            (item.nama_lengkap?.toLowerCase().includes(trimmedQuery)) ||
            (item.nama_marketing?.toLowerCase().includes(trimmedQuery)) ||
            (item.status?.toLowerCase().includes(trimmedQuery))
          )
        : data;

      // Format data untuk response
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
        total, // total dari SP tanpa filtering agar paging konsisten
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data approval request');
    }
  }
}
