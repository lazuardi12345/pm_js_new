// AdAR_CreateInstallmentPayment.usecase.ts
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import {
  CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY,
  IClientInstallmentFrequencyRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_frequency.repository';
import { AdAR_AddExpectedLoanPayoutDateDto } from './DTOS/AdAR_AddExpectedLoanPayoutDate.dto';

@Injectable()
export class AdAR_AddExpectedPayoutInLoanFrequencyUseCase {
  constructor(
    @Inject(CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY)
    private readonly frequencyRepo: IClientInstallmentFrequencyRepository,
  ) {}

  async execute(frequency_id: string, dto: AdAR_AddExpectedLoanPayoutDateDto) {
    try {
      const parsedDate = new Date(dto.expected_payout_date);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException({
          success: false,
          message: 'Format tanggal tidak valid, gunakan YYYY-MM-DD',
          reference: 'EXPECTED_PAYOUT_DATE_INVALID_FORMAT',
        });
      }

      await this.frequencyRepo.addExpectedLoanPayout(frequency_id, parsedDate);

      return {
        payload: {
          success: true,
          message: 'Expected payout date berhasil diupdate',
          reference: 'EXPECTED_PAYOUT_DATE_UPDATED_OK',
          data: {
            frequency_id,
            expected_payout_date: dto.expected_payout_date,
          },
        },
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;

      if (err.message?.includes('tidak ditemukan')) {
        throw new NotFoundException({
          success: false,
          message: err.message,
          reference: 'FREQUENCY_NOT_FOUND',
        });
      }

      return {
        payload: {
          success: false,
          message: err.message || 'Gagal mengupdate expected payout date',
          reference: 'EXPECTED_PAYOUT_DATE_UPDATED_ERROR',
        },
      };
    }
  }
}
