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
      console.log('page:', page, 'pageSize:', pageSize);

      const { data, total } =
        await this.loanAppRepo.callSP_CA_GetApprovalHistory_Internal(
          page,
          pageSize,
        );

      if (!data || data.length === 0) {
        throw new Error('Data pengajuan tidak ditemukan');
      }

      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nasabah_nama.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : data;

      const formattedData = filteredData.map((item) => ({
        id_pengajuan: Number(item.loan_id),
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nasabah_nama,
        nominal_pinjaman: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(Number(item.nominal_pinjaman)),
        id_marketing: item.id_marketing ? Number(item.id_marketing) : null,
        nama_marketing: item.nama_marketing || null,
        status: item.loan_status,
      }));

      return { data: formattedData, total };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal mengambil data pengajuan';
      throw new Error(message);
    }
  }
}
