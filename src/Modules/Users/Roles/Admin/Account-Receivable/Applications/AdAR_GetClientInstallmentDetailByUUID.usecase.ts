// AdAR_GetInstallmentDetail.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  CLIENT_LOAN_INSTALLMENT_REPOSITORY,
  IClientLoanInstallmentRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment.repository';

@Injectable()
export class AdAR_GetClientInstallmentDetailUseCase {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: IClientLoanInstallmentRepository,
  ) {}

  async execute(installmentId: string, frequencyId: string) {
    try {
      const result =
        await this.installmentRepo.callSP_AdAR_GetClientInstallmentDetailByUUID(
          installmentId,
          frequencyId,
        );

      const detail = result[0]?.[0] ?? null;
      const logList = result[1] ?? [];

      if (!detail) {
        return {
          payload: {
            success: false,
            message: 'Data cicilan tidak ditemukan atau frequency tidak cocok',
            reference: 'INSTALLMENT_DETAIL_NOT_FOUND',
            data: null,
          },
        };
      }

      return {
        payload: {
          success: true,
          message: 'Data cicilan berhasil diambil',
          reference: 'INSTALLMENT_DETAIL_OK',
          data: {
            // ── Detail cicilan ───────────────────────────────────────────
            installment_id: detail.installment_id,
            installment_number: Number(detail.bulan_ke),
            contract_number: detail.nomor_kontrak ?? '-',
            description: detail.deskripsi ?? '-',
            billing_amount: detail.tagihan,
            status: detail.status ?? '-',
            total_paid: detail.total_paid, // atau total_paid_amount
            remaining_balance: detail.sisa_tagihan, // atau remaining_bill

            // ── Payment logs ───────────────────────────────────────────
            payment_logs:
              logList.length > 0
                ? logList.map((log: any) => ({
                    detail_id: log.detail_id,
                    amount_paid: log.amount_paid,
                    pay_date: log.pay_date ?? '-',
                    pay_description: log.pay_description ?? '-',
                    created_at: log.created_at ?? '-',
                  }))
                : [],
          },
        },
      };
    } catch (err) {
      return {
        payload: {
          success: false,
          message: err.message || 'Gagal mengambil data cicilan',
          reference: 'INSTALLMENT_DETAIL_ERROR',
        },
      };
    }
  }

  private formatCurrency(amount: number | string | null): string {
    if (!amount || amount === 0) return 'Rp. 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Rp. ${num.toLocaleString('id-ID')}`;
  }
}
