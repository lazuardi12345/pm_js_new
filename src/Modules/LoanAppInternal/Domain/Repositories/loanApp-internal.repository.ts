import {
  TypeApprovalDetail,
  TypeLoanApplicationDetail,
} from 'src/Modules/Users/Roles/Marketing-Internal/Applications/DTOS/MKT_CreateLoanApplication.dto';
import { LoanApplicationInternal } from '../Entities/loan-application-internal.entity';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';

export const LOAN_APPLICATION_INTERNAL_REPOSITORY = Symbol(
  'LOAN_APPLICATION_INTERNAL_REPOSITORY',
);

export interface MarketingStats {
  total_loans: number;
  approved_loans: number;
  rejected_loans: number;
}
export interface SupervisorStats {
  approval_request: number;
  approved_request: number;
  rejected_request: number;
}

export interface ILoanApplicationInternalRepository {
  // ========== Basic CRUD ==========
  findById(id: number): Promise<LoanApplicationInternal | null>;
  findByNasabahId(nasabahId: number): Promise<LoanApplicationInternal[]>;
  findAll(): Promise<LoanApplicationInternal[]>;
  save(loan: LoanApplicationInternal): Promise<LoanApplicationInternal>;
  update(
    id: number,
    loan: Partial<LoanApplicationInternal>,
  ): Promise<LoanApplicationInternal>;
  delete(id: number): Promise<void>;

  updateLoanAppInternalStatus(
    loan_id: number,
    status: StatusPengajuanEnum,
  ): Promise<void>;

  triggerBanding(loan_id: number, alasan_banding: string);
  triggerFinalLoanStatus(loan_id: number, status_akhir_pengajuan: string);

  //! ========== GENERAL ==========

  callSP_GENERAL_GetAllPreviewDataLoanBySearch_Internal(
    role: RoleSearchEnum,
    type: TypeSearchEnum,
    keyword: string,
    page?: number,
    pageSize?: number,
  ): Promise<{ data: any[]; totalData: number; approvals?: any[] }>;

  //! ========== MARKETING ==========
  callSP_MKT_GetAllLoanApplications_Internal(
    marketingId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_MKT_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;

  callSP_MKT_GetDashboard_Internal(
    marketingId: number,
  ): Promise<MarketingStats>;

  //! ========== SUPERVISOR (SPV) ==========
  callSP_SPV_GetAllApprovalHistory_ByTeam(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_SPV_GetAllApprovalRequest_Internal(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_SPV_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
  callSP_SPV_GetAllTeams_Internal(supervisorId: number): Promise<any[]>;
  callSP_SPV_GetDashboard_Internal(
    supervisorId: number,
  ): Promise<SupervisorStats>;

  //!========== HEAD MARKETING (HM) ==========
  callSP_HM_GetAllApprovalHistory_Internal(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_HM_GetAllApprovalRequest_Internal(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_HM_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
  callSP_HM_GetAllTeams_Internal(hmId: number): Promise<any[]>;

  callSP_HM_GetAllUsers(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;

  //! ========== CREDIT ANALYST (CA) ==========
  callSP_CA_GetApprovalHistory_Internal(
    creditAnalystId: number,
    page: number,
    pageSize: number,
  ): Promise<{
    results: any;
    data: any[];
    total: number;
  }>;
  callSP_CA_GetAllApprovalRequest_Internal(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_CA_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
  callSP_CA_GetDashboard_Internal(
    creditAnalystId: number,
  ): Promise<SupervisorStats>;
}
