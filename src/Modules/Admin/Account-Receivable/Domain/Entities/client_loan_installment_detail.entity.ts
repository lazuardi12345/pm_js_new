export class ClientLoanInstallmentDetail {
  constructor(
    public amount_paid: number,
    public pay_date: Date,
    public pay_description: string,

    public readonly id?: string,
    public readonly installment_id?: string, // FK → tbl_client_loan_installment
    public readonly created_at?: Date,
    public updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {}
}
