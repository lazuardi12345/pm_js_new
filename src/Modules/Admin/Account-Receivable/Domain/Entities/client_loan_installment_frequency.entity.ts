import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';

export class ClientInstallmentFrequency {
  constructor(
    public loan_frequency: number,
    public application_date: Date,
    public loan_amount: number,
    public loan_tenor: number,
    public revenue_forecast: number,
    public outstanding_receivable_total: number,
    public pay_type: PayType,
    public expected_payout_date?: Date | null,
    public readonly id?: string,
    public readonly loan_agreement_id?: number,
    public readonly client_id?: string, // FK → tbl_client_loan_installment_internal
    public readonly created_at?: Date,
    public updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {}
}
