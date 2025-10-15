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

  async execute(hmId: number, page = 1, pageSize = 10, searchQuery = '') {
    try {
      console.log('📥 UseCase Request:', { hmId, page, pageSize, searchQuery });

      const { data, total } =
        await this.loanAppRepo.callSP_HM_GetAllApprovalRequest_Internal(
          hmId,
          page,
          pageSize,
        );

      if (!data || data.length === 0) {
        return { data: [], total: 0 };
      }

      // Filter jika ada search query
      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nasabah_nama
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
        : data;

      // Format hasilnya
      const formattedData = filteredData.map((item) => {
        const nominal = Number(item.nominal_pinjaman) || 0;

        return {
          pengajuan_id: item.pengajuan_id || null,
          id_nasabah: item.nasabah_id || null,
          nama_nasabah: item.nasabah_nama || '-',
          pinjaman_ke: item.pinjaman_ke || 0,
          nominal_pinjaman: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(nominal),
          tenor: item.tenor ? `${item.tenor} bulan` : '0 bulan',
          id_marketing: item.marketing_id || null,
          nama_marketing: item.marketing_nama || '-',
          waktu_pengajuan: item.waktu_pengajuan || '-',
          status_loan: item.status_loan || '-',
          perusahaan: item.perusahaan || '-',
          is_banding: !!item.is_banding,
        };
      });

      return {
        data: formattedData,
        total,
      };
    } catch (err) {
      console.error('❌ Error di UseCase HM_GetAllApprovalRequest:', err);
      throw new Error(err.message || 'Gagal mengambil data pengajuan untuk HM');
    }
  }
}
