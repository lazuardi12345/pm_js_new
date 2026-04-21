// AdAR_CreateInstallmentPayment.usecase.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AdAR_CreateInstallmentPaymentDto } from './DTOS/AdAR_CreateInstallmentPayment.dto';
import {
  CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY,
  IClientLoanInstallmentDetailRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_detail.repository';

@Injectable()
export class AdAR_CreateInstallmentPaymentUseCase {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY)
    private readonly detailRepo: IClientLoanInstallmentDetailRepository,
  ) {}

  async execute(dto: AdAR_CreateInstallmentPaymentDto) {
    try {
      if (dto.amount_paid <= 0) {
        throw new BadRequestException('Nominal pembayaran harus lebih dari 0');
      }

      const result = await this.detailRepo.createPayment(
        dto.installment_id,
        dto.amount_paid,
        dto.pay_date,
        dto.pay_description ?? null,
      );

      return {
        payload: {
          success: true,
          message: 'Pembayaran berhasil disimpan',
          reference: 'INSTALLMENT_PAYMENT_CREATED_OK',
          data: {
            detail_id: result.id,
            installment_id: result.installment_id,
            amount_paid: `Rp. ${Number(result.amount_paid).toLocaleString('id-ID')}`,
            pay_date: result.pay_date,
            pay_description: result.pay_description ?? '-',
          },
        },
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;

      return {
        payload: {
          success: false,
          message: err.message || 'Gagal menyimpan pembayaran',
          reference: 'INSTALLMENT_PAYMENT_CREATED_ERROR',
        },
      };
    }
  }
}
