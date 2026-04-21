// Applications/UseCases/AdAR_GetAllClientLoanInstallmentInternal.usecase.ts

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { GetAllClientLoanInstallmentInternalDto } from './DTOS/AdAR_ClientInternal.dto';
import {
  CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY,
  IClientLoanInstallmentInternalRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_internal.repository';

@Injectable()
export class AdAR_GetAllClientLoanInstallmentInternalUseCase {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY)
    private readonly clientLoanInstallmentInternalRepo: IClientLoanInstallmentInternalRepository,
  ) {}

  async execute(dto: GetAllClientLoanInstallmentInternalDto) {
    try {
      const page = Math.max(1, dto.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, dto.pageSize ?? 10));

      const result =
        await this.clientLoanInstallmentInternalRepo.callSP_GetAllClientLoanInstallmentInternal(
          dto.searchByClientName?.trim() || null,
          dto.companyName ?? null,
          page,
          pageSize,
        );

      if (!result || result.length < 1) {
        return {
          payload: {
            error: false,
            message: 'No data found',
            reference: 'CLIENT_LOAN_INSTALLMENT_INTERNAL_EMPTY',
            data: [],
            meta: {
              total: 0,
              totalPages: 0,
              currentPage: page,
              pageSize,
            },
          },
        };
      }

      const metadata = result[0]?.[0] || {};
      const totalRecords = Number(metadata?.total_records || 0);
      const totalPages = Number(metadata?.total_pages || 0);
      const rawData = result[1] || [];

      const mappedData = rawData.map((item: any) => {
        try {
          return {
            id: item?.id ?? null,
            client_name: item?.client_name ?? '-',
            total_amount_due: item?.total_amount_due,
            revenue_forecast: item?.revenue_forecast,
            total_outstanding_receivables: item?.total_outstanding_receivables,

            payment_status_performance: item?.payment_status_performance ?? '-',
            created_at: this.formatDateTime(item?.created_at),
            updated_at: this.formatDateTime(item?.updated_at),
          };
        } catch (itemErr) {
          console.error(
            '[AdAR_GetAllClientLoanInstallmentInternal] Error mapping item:',
            itemErr,
          );
          return {
            error: true,
            message: 'Failed to process this item',
            reference: 'CLIENT_LOAN_INSTALLMENT_INTERNAL_ITEM_ERROR',
            rawItem: item ?? null,
          };
        }
      });

      return {
        payload: {
          success: true,
          message: 'Client loan installment internal retrieved successfully',
          reference: 'CLIENT_LOAN_INSTALLMENT_INTERNAL_OK',
          data: mappedData,
          totalPages,
          pageSize,
        },
      };
    } catch (err) {
      console.error('[AdAR_GetAllClientLoanInstallmentInternal]', err);

      return {
        payload: {
          success: false,
          message: err.message || 'Failed to retrieve data',
          reference: 'CLIENT_LOAN_INSTALLMENT_INTERNAL_ERROR',
          error: err?.stack || null,
        },
      };
    }
  }

  private formatCurrency(amount: number | string | null): string {
    if (!amount || amount === 0) return 'Rp 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'Rp 0';
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  private formatDateTime(datetime: string | Date | null): string {
    if (!datetime) return '-';
    try {
      const d = typeof datetime === 'string' ? new Date(datetime) : datetime;
      if (isNaN(d.getTime())) return '-';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${dd}-${mm}-${yy} ${hh}:${min}`;
    } catch {
      return '-';
    }
  }
}
