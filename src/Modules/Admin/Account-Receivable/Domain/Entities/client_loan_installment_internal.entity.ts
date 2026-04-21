export class ClientLoanInstallmentInternal {
  constructor(
    public client_name: string,
    public nik: number,
    public company_name: string,
    public original_loan_principal: number,
    public revenue_forecast: number,
    public outstanding_receivable_total: number,

    public readonly id?: string,
    public readonly created_at?: Date,
    public updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {}
}
