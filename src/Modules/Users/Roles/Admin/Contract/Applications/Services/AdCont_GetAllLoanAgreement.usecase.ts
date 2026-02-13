// src/Modules/Admin/Contracts/Application/UseCases/AdCont_GetAllLoanAgreement_UseCase.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  ILoanAgreementRepository,
  LOAN_AGREEMENT_REPOSITORY,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/loan-agreements.repository';
import { GetAllLoanAgreementDto } from '../DTOS/AdCont_GetLoanAgreementData.dto';

export interface LoanAgreementData {
  id: number;
  nomor_kontrak: string;
  nomor_urut: number;
  nama: string;
  alamat: string;
  no_ktp: number;
  type: string;
  perusahaan: string;
  inisial_marketing: string;
  golongan: string;
  inisial_ca: string;
  id_card: string;
  kedinasan: string;
  pinjaman_ke: number;
  pokok_pinjaman: number;
  tenor: number;
  biaya_admin: number;
  cicilan: number;
  biaya_layanan: number;
  bunga: number;
  tanggal_jatuh_tempo: Date;
  catatan: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class AdCont_GetAllLoanAgreementsUseCase {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly loanAgreementRepo: ILoanAgreementRepository,
  ) {}

  async execute(dto: GetAllLoanAgreementDto) {
    try {
      // Validate search nama minimum 3 characters
      if (dto.searchByName && dto.searchByName.trim().length < 3) {
        throw new BadRequestException({
          success: false,
          message: 'Pencarian nama minimal 3 karakter untuk performa optimal',
          reference: 'SEARCH_NAMA_MIN_LENGTH',
        });
      }

      // Call repository to execute SP
      const result =
        await this.loanAgreementRepo.callSP_AdCont_GetAllLoanAgreementData(
          dto.searchByContractNumber || null,
          dto.searchByResidentNumber
            ? Number(dto.searchByResidentNumber)
            : null,
          dto.searchByName ? dto.searchByName.trim() : null,
          dto.page || 1,
          dto.pageSize || 10,
        );

      // Validate result structure
      if (!result || result.length < 2) {
        return {
          payload: {
            success: true,
            message: 'No loan agreement data found',
            reference: 'LOAN_AGREEMENT_EMPTY',
            data: [],
            meta: {
              total: 0,
              totalPages: 0,
              currentPage: dto.page || 1,
              pageSize: dto.pageSize || 10,
            },
          },
        };
      }

      // Extract metadata from OUT parameters
      const metadata = result[0]?.[0] || {};
      const totalRecords = Number(metadata?.total_records || 0);
      const totalPages = Number(metadata?.total_pages || 0);

      // Extract actual data from second result set
      const rawData: LoanAgreementData[] = result[1] || [];

      // Map and format data
      const mappedData = rawData.map((item) => {
        try {
          return {
            id: Number(item?.id ?? 0),
            nomor_kontrak: item?.nomor_kontrak ?? '-',
            nomor_urut: item?.nomor_urut ?? null,
            nama: item?.nama ?? '-',
            alamat: item?.alamat ?? '-',
            no_ktp: String(item?.no_ktp ?? '-'),
            type: item?.type ?? '-',
            perusahaan: item?.perusahaan ?? null,
            inisial_marketing: item?.inisial_marketing ?? '-',
            golongan: item?.golongan ?? null,
            inisial_ca: item?.inisial_ca ?? null,
            id_card: item?.id_card ?? null,
            kedinasan: item?.kedinasan ?? null,
            pinjaman_ke: item?.pinjaman_ke ?? null,

            // Format financial data
            pokok_pinjaman: this.formatCurrency(item?.pokok_pinjaman),
            biaya_admin: this.formatCurrency(item?.biaya_admin),
            cicilan: this.formatCurrency(item?.cicilan),
            biaya_layanan: this.formatCurrency(item?.biaya_layanan),
            bunga: this.formatCurrency(item?.bunga),

            tenor: `${item?.tenor ?? 0} bulan`,
            tanggal_jatuh_tempo: this.formatDate(item?.tanggal_jatuh_tempo),
            catatan: item?.catatan ?? null,
            created_at: this.formatDateTime(item?.created_at),
            updated_at: this.formatDateTime(item?.updated_at),
          };
        } catch (itemErr) {
          console.error('Error mapping loan agreement item:', itemErr);
          return {
            error: true,
            message: 'Failed to process this loan agreement item',
            reference: 'LOAN_AGREEMENT_ITEM_ERROR',
            rawItem: item ?? null,
          };
        }
      });

      return {
        payload: {
          success: true,
          message: 'Loan agreement data retrieved successfully',
          reference: 'LOAN_AGREEMENT_OK',
          data: mappedData,

          total: totalRecords,
          page: dto.page || 1,
          pageSize: dto.pageSize || 10,

          filters: {
            searchByContractNumber: dto.searchByContractNumber || null,
            searchByResidentNumber: dto.searchByResidentNumber || null,
            searchByName: dto.searchByName || null,
          },
        },
      };
    } catch (err) {
      console.error('Error in GetAllLoanAgreement UseCase:', err);

      if (err instanceof BadRequestException) {
        throw err;
      }

      return {
        payload: {
          success: false,
          message: err.message || 'Failed to retrieve loan agreement data',
          reference: 'LOAN_AGREEMENT_ERROR',
          error: err?.stack || null,
        },
      };
    }
  }

  private formatCurrency(amount: number | string | null): string {
    if (!amount || amount === 0) return 'Rp 0';

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) return 'Rp 0';

    return `Rp ${numAmount.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  private formatDate(date: string | Date | null): string {
    if (!date) return '-';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(dateObj.getTime())) return '-';

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    } catch {
      return '-';
    }
  }

  private formatDateTime(datetime: string | Date | null): string {
    if (!datetime) return '-';

    try {
      const dateObj =
        typeof datetime === 'string' ? new Date(datetime) : datetime;

      if (isNaN(dateObj.getTime())) return '-';

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return '-';
    }
  }
}
