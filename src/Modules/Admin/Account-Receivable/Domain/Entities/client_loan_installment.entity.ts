import { InstallmentStatus } from 'src/Shared/Enums/Admins/Account-Receivable/InstallmentStatus';

export type InstallmentMetadata = {
  company_name?: string;
  pay_type?: string;
};
export class ClientLoanInstallment {
  constructor(
    public frequency_number: number,
    public nomor_kontrak: string, // ← tambah ini
    public description: string,
    public amount_due: number,
    public status: InstallmentStatus,

    public readonly metadata?: InstallmentMetadata,
    public readonly id?: string,
    public readonly frequency_id?: string, // FK → tbl_client_installment_frequency
    public readonly created_at?: Date,
    public updated_at?: Date,
    public readonly deleted_at?: Date | null,
  ) {}
}
