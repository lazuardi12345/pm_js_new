import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import {
  AdAR_GetExportableCSVDataDto,
  ExportableFrequencyStatusFilter,
} from './DTOS/AdAR_GetExportableCSVData.dto';
import {
  CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY,
  FotsDeductionRaw,
  IbuDeductionRaw,
  IClientInstallmentFrequencyRepository,
  IlwDeductionRaw,
  TsiiDeductionRaw,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_frequency.repository';

@Injectable()
export class AdAR_GetExportableCSVDataUseCase {
  constructor(
    @Inject(CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY)
    private readonly frequencyRepo: IClientInstallmentFrequencyRepository,
  ) {}

  async execute(dto: AdAR_GetExportableCSVDataDto) {
    try {
      if (!dto.company_name) {
        throw new BadRequestException('company_name is required');
      }
      if (!dto.frequency_status) {
        throw new BadRequestException('frequency_status is required');
      }
      const validStatuses: ExportableFrequencyStatusFilter[] = [
        'on_going',
        'closing_installment',
        'all',
      ];
      if (!validStatuses.includes(dto.frequency_status)) {
        throw new BadRequestException(
          `frequency_status must be one of: ${validStatuses.join(', ')}`,
        );
      }

      const page = dto.page && dto.page > 0 ? dto.page : 1;
      const pageSize = dto.page_size && dto.page_size > 0 ? dto.page_size : 10;

      const rows =
        await this.frequencyRepo.callSP_AdAR_DispatchExportableCSVData(
          dto.company_name,
          dto.frequency_status,
          page,
          pageSize,
        );

      let data:
        | ReturnType<typeof this.mapILWRow>[]
        | ReturnType<typeof this.mapFOTSRow>[]
        | ReturnType<typeof this.mapIBURow>[]
        | ReturnType<typeof this.mapTSIIRow>[];

      switch (dto.company_name.toUpperCase()) {
        case 'ILW':
          data = (rows as IlwDeductionRaw[]).map((row) => this.mapILWRow(row));
          break;

        case 'FOTS':
          data = (rows as FotsDeductionRaw[]).map((row) =>
            this.mapFOTSRow(row),
          );
          break;

        case 'IBU':
          data = (rows as IbuDeductionRaw[]).map((row) => this.mapIBURow(row));
          break;

        case 'TSII':
          data = (rows as TsiiDeductionRaw[]).map((row) =>
            this.mapTSIIRow(row),
          );
          break;

        default:
          throw new BadRequestException(
            `Unsupported company: ${dto.company_name}`,
          );
      }

      return {
        payload: {
          error: false,
          message: 'Exportable CSV data fetched successfully',
          reference: 'EXPORTABLE_CSV_DATA_OK',
          data,
          pagination: {
            page,
            page_size: pageSize,
            total: data.length,
          },
        },
      };
    } catch (err) {
      console.error(err);

      if (err instanceof BadRequestException) {
        throw err;
      }
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        {
          payload: {
            error: 'UNEXPECTED ERROR',
            message: err.message || 'Unexpected error',
            reference: 'EXPORTABLE_CSV_DATA_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapILWRow(row: IlwDeductionRaw) {
    return {
      name: row.nama,
      loan_number: row.ke,
      bill: parseFloat(row.potongan),
      admin_fee: parseFloat(row.adm),
      is_closing: row.is_closing === 1,
      frequency_status: row.frequency_status,
    };
  }

  private mapIBURow(row: IbuDeductionRaw) {
    return {
      name: row.nama,
      loan_number: row.ke,
      bill: parseFloat(row.potongan),
      admin_fee: parseFloat(row.adm),
      is_closing: row.is_closing === 1,
      frequency_status: row.frequency_status,
    };
  }

  private mapFOTSRow(row: FotsDeductionRaw) {
    return {
      name: row.nama,
      loan_number: row.pinjaman_ke,
      principal_installment: parseFloat(row.pokok_cicilan),
      interest_installment: parseFloat(row.bunga_cicilan),
      tenor: row.tenor,
      monthly_installment: parseFloat(row.cicilan_per_bulan),
      monthly_interest: parseFloat(row.bunga_per_bulan),
      admin_fee: parseFloat(row.admin),
      next_month_bill: parseFloat(row.tagihan_bulan_depan),
      remaining_total_bill: parseFloat(row.sisa_total_tagihan),
      estimated_remaining_bill: parseFloat(row.prakiraan_total_tagihan),
      is_closing: row.is_closing === 1,
      frequency_status: row.frequency_status,
    };
  }

  private mapTSIIRow(row: TsiiDeductionRaw) {
    return {
      name: row.nama,
      loan_number: row.pinjaman_ke,
      principal_installment: parseFloat(row.pokok_cicilan),
      interest_installment: parseFloat(row.bunga_cicilan),
      tenor: row.tenor,
      monthly_installment: parseFloat(row.cicilan_per_bulan),
      monthly_interest: parseFloat(row.bunga_per_bulan),
      admin_fee: parseFloat(row.admin),
      next_month_bill: parseFloat(row.tagihan_bulan_depan),
      remaining_total_bill: parseFloat(row.sisa_total_tagihan),
      estimated_remaining_bill: parseFloat(row.prakiraan_total_tagihan),
      is_closing: row.is_closing === 1,
      frequency_status: row.frequency_status,
    };
  }
}
