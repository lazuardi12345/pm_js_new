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

  async execute(hmId: number, page = 1, pageSize = 10, searchQuery = '') {
    try {
      const { data, total } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalHistory_Internal(
          hmId,
          page,
          pageSize,
        );

      const trimmedQuery = searchQuery.trim().toLowerCase();

      // Filter data jika ada search query
      const filteredData =
        trimmedQuery.length > 0
          ? data.filter(
              (item) =>
                item.nama_lengkap?.toLowerCase().includes(trimmedQuery) ||
                item.nama_marketing?.toLowerCase().includes(trimmedQuery) ||
                item.status?.toLowerCase().includes(trimmedQuery),
            )
          : data;

      // Format data
      const formattedData = filteredData.map((item) => ({
        id_pengajuan: Number(item.loan_id),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nasabah_nama || '-',
        nominal_pinjaman: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item.nominal_pinjaman)),
        nama_marketing: item.marketing_nama || '-',
        nama_credit_analyst: item.ca_nama || '-',
        ca_status: item.ca_status || '-',
        ca_is_banding: item.ca_is_banding || 0,
        ca_approved_at: item.ca_approved_at || '-',
        nama_supervisor: item.spv_nama || '-',
        spv_status: item.spv_status || '-',
        spv_is_banding: item.spv_is_banding || 0,
        spv_approved_at: item.spv_approved_at || '-',
        status: item.approval_status || '-',
        pinjaman_ke: item.pinjaman_ke || '-',
        tenor: item.tenor || '-',
        waktu_pengajuan: item.waktu_pengajuan || '-',
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
