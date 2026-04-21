// Applications/UseCases/AdAR_MarkBadDebt.usecase.ts

import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AdAR_MarkBadDebtDto } from './DTOS/AdAR_MarkDebt.dto';
import {
  CLIENT_LOAN_INSTALLMENT_REPOSITORY,
  IClientLoanInstallmentRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment.repository';
import {
  CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY,
  IClientLoanInstallmentDetailRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_detail.repository';
import { LogClientLoanInstallmentService } from 'src/Modules/Admin/Account-Receivable/Applications/Services/log_client_loan_installment.service';
import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

@Injectable()
export class AdAR_MarkBadDebtUseCase {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: IClientLoanInstallmentRepository,

    @Inject(CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY)
    private readonly detailRepo: IClientLoanInstallmentDetailRepository,

    private readonly logService: LogClientLoanInstallmentService,
  ) {}

  async execute(
    dto: AdAR_MarkBadDebtDto,
    changer_id: number,
    changed_by: string,
  ) {
    try {
      const targetInstallments =
        await this.installmentRepo.findByFrequencyIdFromNumber(
          dto.frequency_id,
          dto.from_frequency_number,
        );

      if (!targetInstallments.length) {
        throw new NotFoundException({
          success: false,
          message: `Tidak ada cicilan ditemukan mulai dari cicilan ke-${dto.from_frequency_number}`,
          reference: 'BAD_DEBT_INSTALLMENT_NOT_FOUND',
        });
      }

      // 2. Filter yang belum bad_debt
      const toUpdate = targetInstallments.filter(
        (inst) => inst.status !== InstallmentStatus.BAD_DEBT,
      );

      if (!toUpdate.length) {
        throw new BadRequestException({
          success: false,
          message: 'Semua cicilan yang dipilih sudah berstatus bad_debt',
          reference: 'BAD_DEBT_ALREADY_MARKED',
        });
      }

      // 3. Cek masing-masing cicilan apakah ada detail pembayaran
      const installmentWithPaymentCheck = await Promise.all(
        toUpdate.map(async (inst) => {
          const details = await this.detailRepo.findByInstallmentId(inst.id);
          const hasPayment =
            details.length > 0 &&
            details.some((d) => Number(d.amount_paid) > 0);

          return {
            ...inst,
            newStatus: hasPayment
              ? InstallmentStatus.BAD_DEBT_PARTIALLY_PAID // ada bayar → partial
              : InstallmentStatus.BAD_DEBT, // kosong → bad debt
          };
        }),
      );

      // 4. Pisah berdasarkan status baru
      const toPartial = installmentWithPaymentCheck.filter(
        (i) => i.newStatus === InstallmentStatus.BAD_DEBT_PARTIALLY_PAID,
      );
      const toBadDebt = installmentWithPaymentCheck.filter(
        (i) => i.newStatus === InstallmentStatus.BAD_DEBT,
      );

      // 5. Simpan log untuk semua sebelum update
      await this.logService.bulkCreateLog(
        installmentWithPaymentCheck.map((inst) => ({
          installment_id: inst.id,
          previous_status: inst.status,
          new_status: inst.newStatus,
          changer_id,
          changed_by,
        })),
      );

      // 6. Bulk update masing-masing group
      if (toPartial.length) {
        await this.installmentRepo.bulkUpdateStatusByIds(
          toPartial.map((i) => i.id),
          InstallmentStatus.BAD_DEBT_PARTIALLY_PAID,
        );
      }

      if (toBadDebt.length) {
        await this.installmentRepo.bulkUpdateStatusByIds(
          toBadDebt.map((i) => i.id),
          InstallmentStatus.BAD_DEBT,
        );
      }

      return {
        payload: {
          success: true,
          message: `${installmentWithPaymentCheck.length} cicilan berhasil diproses`,
          reference: 'BAD_DEBT_MARKED_OK',
          data: {
            frequency_id: dto.frequency_id,
            from_frequency_number: dto.from_frequency_number,
            total_processed: installmentWithPaymentCheck.length,
            total_bad_debt: toBadDebt.length,
            total_partially: toPartial.length,
            marked_by: {
              changer_id,
              changed_by,
            },
            marked_installments: installmentWithPaymentCheck.map((inst) => ({
              installment_id: inst.id,
              frequency_number: inst.frequency_number,
              previous_status: inst.status,
              new_status: inst.newStatus,
            })),
          },
        },
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      if (err instanceof NotFoundException) throw err;

      return {
        payload: {
          success: false,
          message: err.message || 'Gagal menandai cicilan sebagai bad debt',
          reference: 'BAD_DEBT_MARKED_ERROR',
        },
      };
    }
  }
}
