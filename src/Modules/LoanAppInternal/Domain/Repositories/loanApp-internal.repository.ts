import {
  TypeApprovalDetail,
  TypeLoanApplicationDetail,
} from 'src/Modules/Users/Roles/Marketing-Internal/Applications/DTOS/MKT_CreateLoanApplication.dto';
import { LoanApplicationInternal } from '../Entities/loan-application-internal.entity';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';

export const LOAN_APPLICATION_INTERNAL_REPOSITORY = Symbol(
  'LOAN_APPLICATION_INTERNAL_REPOSITORY',
);

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

  // ========== MARKETING ==========
  callSP_MKT_GetAllLoanApplications_Internal(
    marketingId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_MKT_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;

  // ========== SUPERVISOR (SPV) ==========
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

  // ========== HEAD MARKETING (HM) ==========
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

  // ========== CREDIT ANALYST (CA) ==========
  callSP_CA_GetApprovalHistory_Internal(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_CA_GetAllApprovalRequest_Internal(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_CA_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
}
