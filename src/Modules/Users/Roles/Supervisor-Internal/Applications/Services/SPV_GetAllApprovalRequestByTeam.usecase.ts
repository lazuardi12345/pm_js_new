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
      console.log(
        'spv: ',
        supervisorId,
        'page: ',
        page,
        'pageSize: ',
        pageSize,
      );
      const { data, total } =
        await this.loanAppRepo.callSP_SPV_GetAllApprovalRequest_Internal(
          supervisorId,
          page,
          pageSize,
        );

      if (!data) {
        throw new Error('Data pengajuan tidak ditemukan');
      }

      // Jika ada searchQuery, filter hasilnya
      const filteredData = searchQuery
        ? data.filter((item) =>
            item.nasabah_nama.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : data;

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
        id_nasabah: Number(item.nasabah_id),
        nama_nasabah: item.nasabah_nama,
        nominal_pinjaman: parseNominalPinjaman[0],
        id_marketing: Number(item.user_id),
        nama_marketing: item.marketing_nama,
        status: item.loan_status,
      }));

      return { data: formattedData, total }; // Total tetep pake nilai asli dari SP
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
