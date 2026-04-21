// AdAR_GetClientDetailByUUID.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY,
  IClientLoanInstallmentInternalRepository,
} from 'src/Modules/Admin/Account-Receivable/Domain/Repositories/client_loan_installment_internal.repository';

@Injectable()
export class AdAR_GetClientDetailByUUIDUseCase {
  constructor(
    @Inject(CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY)
    private readonly clientInternalRepo: IClientLoanInstallmentInternalRepository,
  ) {}

  async execute(clientId: string, loanFrequency: number | null) {
    try {
      const result =
        await this.clientInternalRepo.callSP_AdAR_GetClientDetailByUUID(
          clientId,
          loanFrequency,
        );

      const header = result[0]?.[0] ?? null;
      const cicilan = result[1] ?? [];

      if (!header) {
        return {
          payload: {
            success: false,
            message: 'Data nasabah tidak ditemukan',
            reference: 'CLIENT_LOAN_DETAIL_NOT_FOUND',
            data: null,
          },
        };
      }

      // Parse available_loan_frequencies dari GROUP_CONCAT string → number[]
      const availableFrequencies: number[] = header.available_loan_frequencies
        ? String(header.available_loan_frequencies).split(',').map(Number)
        : [];

      return {
        payload: {
          success: true,
          message: 'Data berhasil diambil',
          reference: 'CLIENT_LOAN_DETAIL_OK',
          data: {
            // ── Client info ────────────────────────────────────────────────
            client_id: header.client_id,
            frequency_id: header.frequency_id,
            client_name: header.client_name,
            nik: header.nik,
            company_name: header.company_name,
            pay_type: header.pay_type ?? '-',

            // ── Tab pinjaman ───────────────────────────────────────────────
            available_loan_frequencies: availableFrequencies,
            active_loan_frequency: Number(header.pinjaman_ke),

            // ── Summary frequency terpilih (lingkaran hitam) ───────────────
            original_loan_principal: header.pinjaman_pokok,
            revenue_forecast: header.total_nominal_plus_bunga,

            application_date: header.tanggal_pengajuan ?? '-',
            expected_payout_date: header.tanggal_pencairan ?? '-',
            tenor: `${header.tenor} Bulan`,
            status: header.status_nasabah ?? '-',

            // ── Total sisa piutang (pojok kanan atas) ──────────────────────
            outstanding_receivable_total: header.total_sisa_piutang,

            // ── Tabel cicilan ──────────────────────────────────────────────
            all_installments: cicilan.map((row: any) => ({
              installment_id: row.installment_id,
              billing_cycle: Number(row.bulan_ke),
              contract_number: row.nomor_kontrak ?? '-',
              description: row.deskripsi ?? '-',
              bill_amount: row.tagihan,
              status: row.status ?? '-',
              metadata: row.metadata ?? '-',
              payment_sequence: Number(row.frek_bayar ?? 0),
              amount_paid: row.total_dibayar,
              outstanding_amount: row.sisa_tagihan,
            })),
          },
        },
      };
    } catch (err) {
      return {
        payload: {
          success: false,
          message: err.message || 'Gagal mengambil data loan detail',
          reference: 'CLIENT_LOAN_DETAIL_ERROR',
        },
      };
    }
  }

  //   private formatCurrency(amount: number | string | null): string {
  //     if (!amount || amount === 0) return 'Rp. 0';
  //     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  //     return `Rp. ${num.toLocaleString('id-ID')}`;
  //   }
}
