// src/Modules/LoanAppInternal/Application/mkt-get-all-loan-application.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class CA_GetAllApprovalRequest_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(page = 1, pageSize = 10, searchQuery = '') {
    try {
      console.log('page: ', page, 'pageSize: ', pageSize);
      const { data, total } =
        await this.loanAppRepo.callSP_CA_GetAllApprovalRequest_Internal(
          page,
          pageSize,
        );

      if (!data) {
        throw new Error('Data pengajuan tidak ditemukan');
      }

      // Jika ada searchQuery, filter hasilnya
      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nama_nasabah.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : data;

      console.log('icikiwir >>>', filteredData);

      const parseNominalPinjaman = filteredData.map((data) => {
        const nominal = Number(data.nominal_pinjaman);
        const formattedNominal = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(nominal);
        return formattedNominal;
      });

      const formattedData = filteredData.map((item) => ({
        id_pengajuan: Number(item.loan_id),
        nama_nasabah: item.nama_nasabah,
        nominal_pinjaman: parseNominalPinjaman[0],
        nama_marketing: item.nama_marketing,
        nama_supervisor: item.nama_supervisor,
        status: item.status_pengajuan,
      }));

      return { data: formattedData, total }; // Total tetep pake nilai asli dari SP
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
