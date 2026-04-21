// Domain/Repositories/IClientInstallmentFrequencyRepository.ts

import { FrequencyStatus } from 'src/Shared/Enums/Admins/Account-Receivable/FrequencyStatus';
import { ClientInstallmentFrequency } from '../Entities/client_loan_installment_frequency.entity';
import { ExportableFrequencyStatusFilter } from 'src/Modules/Users/Roles/Admin/Account-Receivable/Applications/DTOS/AdAR_GetExportableCSVData.dto';

export const CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY = Symbol(
  'CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY',
);

export interface LoanFrequencySummaryRaw {
  internal_id: string;
  client_name: string;
  company_name: string;
  nik: string;

  frequency_id: string;
  loan_frequency: number;
  application_date: string;
  expected_payout_date: string | null;
  loan_amount: string;
  freq_revenue_forecast: string;
  freq_outstanding: string;
  loan_tenor: number;
  pay_type: string;
  frequency_status: FrequencyStatus;

  total_installments: number;
  total_amount_due: string;
  paid_count: number;
  unpaid_count: number;
  partially_paid_count: number;
  bad_debt_count: number;
  remaining_amount_due: string;
}

export interface IlwDeductionRaw {
  nama: string;
  ke: number;
  potongan: string;
  adm: string;
  is_closing: 0 | 1;
  frequency_status: FrequencyStatus;
}

export interface IbuDeductionRaw {
  nama: string;
  ke: number;
  potongan: string;
  adm: string;
  is_closing: 0 | 1;
  frequency_status: FrequencyStatus;
}

export interface FotsDeductionRaw {
  nama: string;
  pinjaman_ke: number;
  pokok_cicilan: string;
  bunga_cicilan: string;
  tenor: number;
  cicilan_per_bulan: string;
  bunga_per_bulan: string;
  admin: string;
  tagihan_bulan_depan: string;
  sisa_total_tagihan: string;
  prakiraan_total_tagihan: string;
  is_closing: 0 | 1;
  frequency_status: FrequencyStatus;
}

export interface TsiiDeductionRaw {
  nama: string;
  pinjaman_ke: number;
  pokok_cicilan: string;
  bunga_cicilan: string;
  tenor: number;
  cicilan_per_bulan: string;
  bunga_per_bulan: string;
  admin: string;
  tagihan_bulan_depan: string;
  sisa_total_tagihan: string;
  prakiraan_total_tagihan: string;
  is_closing: 0 | 1;
  frequency_status: FrequencyStatus;
}

export interface IClientInstallmentFrequencyRepository {
  create(
    entity: ClientInstallmentFrequency,
  ): Promise<ClientInstallmentFrequency>;
  update(
    id: string,
    entity: Partial<ClientInstallmentFrequency>,
  ): Promise<ClientInstallmentFrequency>;
  findAll(): Promise<ClientInstallmentFrequency[]>;
  findById(id: string): Promise<ClientInstallmentFrequency | null>;
  findByClientId(client_id: string): Promise<ClientInstallmentFrequency[]>;
  delete(id: string): Promise<void>;

  addExpectedLoanPayout(
    frequency_id: string,
    expected_payout_date: Date,
  ): Promise<void>;

  callSP_AdAR_GetExportableCSVData(
    companyName: string,
    frequencyStatus: FrequencyStatus,
    page: number,
    pageSize: number,
  ): Promise<LoanFrequencySummaryRaw[]>;

  callSP_AdAR_DispatchExportableCSVData(
    companyName: string,
    frequencyStatus: ExportableFrequencyStatusFilter,
    page: number,
    pageSize: number,
  ): Promise<
    | IlwDeductionRaw[]
    | FotsDeductionRaw[]
    | IbuDeductionRaw[]
    | TsiiDeductionRaw[]
  >;
}
