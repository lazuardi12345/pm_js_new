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
  ) { }

  async execute(
    hmId: number,
    page = 1,
    pageSize = 10,
    searchQuery = '',
  ) {
    try {
      console.log('[HM_GetAllApprovalHistory] Params:', {
        hmId,
        page,
        pageSize,
        searchQuery,
      });

      const { total, data } = await this.loanAppRepo.callSP_HM_GetAllApprovalHistory_Internal(
        hmId,
        page,
        pageSize,
      );
      console.log('Total:', total);
      console.log('Data:', data);

      if (!Array.isArray(data) || data.length === 0) {
        return { data: [], total };
      }

      // Filter pencarian nama nasabah (jika ada)
      const filtered = searchQuery
        ? data.filter((item) =>
          item.nasabah_nama?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        : data;

      // Mapping hasil agar sesuai response yang diharapkan
      const formatted = filtered.map((item) => ({
        id_pengajuan: Number(item.loan_id),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nasabah_nama || '-',
        nominal_pinjaman: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(Number(item.nominal_pinjaman || 0)),
        id_marketing: Number(item.user_id),
        nama_marketing: item.marketing_nama || '-',
        status: item.loan_status || '-',
        approval_internal: [
          {
            approval_status: item.approval_status || '-',
            approval_role: item.approval_role || '-',
          }
        ],
        is_banding: !!item.is_banding,
        keterangan: item.keterangan || '',
        kesimpulan: item.kesimpulan || '',
        approval_created_at: item.approval_created_at || '',
      }));


      return {
        data: formatted,
        total,
      };
    } catch (error) {
      console.error('[HM_GetAllApprovalHistory] Error:', error);
      throw new Error(error.message || 'Gagal mengambil data pengajuan oleh HM');
    }
  }
}


