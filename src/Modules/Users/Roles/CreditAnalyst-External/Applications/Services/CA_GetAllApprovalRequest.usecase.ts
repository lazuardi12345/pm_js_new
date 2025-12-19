import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class CA_GetAllApprovalRequest_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(page = 1, pageSize = 10, searchQuery = '') {
    try {
      console.log(
        'page:',
        page,
        'pageSize:',
        pageSize,
        'searchQuery:',
        searchQuery,
      );

      // Step 1: Ambil semua data tanpa pagination dari SP
      const { data } =
        await this.loanAppRepo.callSP_CA_GetAllApprovalRequest_External(
          1,
          500, // Ambil semua data untuk kebutuhan search
        );

      if (!data || data.length === 0) {
        return {
          data: [],
          page,
          pageSize,
          total: 0,
        };
      }

      // Step 2: Filter jika ada search query
      const trimmedQuery = searchQuery.trim().toLowerCase();
      const filteredData = trimmedQuery
        ? data.filter((item) =>
            item.nama_nasabah?.toLowerCase().includes(trimmedQuery),
          )
        : data;

      // Step 3: Pagination manual
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      // Step 4: Format hasil
      const formattedData = paginatedData.map((item) => {
        const nominal = Number(item.nominal_pinjaman);
        const formattedNominal = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(nominal);

        return {
          id_pengajuan: Number(item.loan_id),
          nama_nasabah: item.nama_nasabah,
          tipe_nasabah: 'reguler',
          jenis_pembiayaan: item.jenis_pembiayaan,
          nominal_pinjaman: formattedNominal,
          nama_marketing: item.nama_marketing,
          nama_supervisor: item.nama_supervisor,
          status: item.status_pengajuan,
        };
      });

      return {
        data: formattedData,
        page,
        pageSize,
        total: filteredData.length, // total setelah filter
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal mengambil data pengajuan');
    }
  }
}
