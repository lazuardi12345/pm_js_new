export type ApprovalDetail = {
  name: string | null;
  status: string | null;
  approval_status: string;
  response_at: Date | null;
  approved_amount: number | null;
  approved_tenor: number | null;
  keterangan: string;
};

export type SurveyorResult = {
  visited_person: string | null;
  visited_time: string | null;
};

export interface LoanApplicationSummary {
  // Data Loan Application
  loan_id: number;
  id_pengajuan: number;
  customer_id: number;
  customer_name: string;
  nama_nasabah: string;
  loan_amount: number;
  nominal_pinjaman: number;
  pinjaman_ke: number;
  tenor: number;
  jenis_pembiayaan: string;
  approval_request_submitted_at: Date;
  created_at: Date;
  approval_request_responded_at: Date;
  latest_loan_app_status: string;
  status_pengajuan: string;
  final_status: string | null;
  marketing_name: string;

  // Timeline Pengajuan Awal (APP) - Credit Analyst
  loan_application_status: {
    spv: ApprovalDetail;
    svy: SurveyorResult;
    ca: ApprovalDetail;
    hm: ApprovalDetail;
  };
  loan_appeal_status: {
    ca: ApprovalDetail;
    hm: ApprovalDetail;
  };
}
