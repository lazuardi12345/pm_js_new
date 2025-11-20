// Domain/Repositories/approval-external.repository.ts
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { LoanApplicationExternal } from '../Entities/loanApp-external.entity';
import {
  MarketingStats,
  SupervisorStats,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import { paginationInterface } from 'src/Shared/Interface/Pagination.interface';
import { General_ClientDataInterface } from 'src/Shared/Interface/General_ClientsDatabase/ClientData.interface';
import { General_LoanApplicationDataInterface } from 'src/Shared/Interface/General_ClientsDatabase/ClientHistoryLoanApplication.interface';
import { LoanApplicationSummary } from 'src/Shared/Interface/General_ClientsDatabase/BankDataLoanApplication.interface';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';
import {
  TypeApprovalDetail,
  TypeLoanApplicationDetail,
} from 'src/Modules/Users/Roles/Marketing-External/Applications/DTOS/MKT_CreateLoanApplicationExternal.dto';

export const LOAN_APPLICATION_EXTERNAL_REPOSITORY =
  ' LOAN_APPLICATION_EXTERNAL_REPOSITORY';

export interface ILoanApplicationExternalRepository {
  findById(id: number): Promise<LoanApplicationExternal | null>;
  findByNasabahId(nasabahId: number): Promise<LoanApplicationExternal[]>;
  findAll(): Promise<LoanApplicationExternal[]>;
  save(address: LoanApplicationExternal): Promise<LoanApplicationExternal>;
  update(
    id: number,
    address: Partial<LoanApplicationExternal>,
  ): Promise<LoanApplicationExternal>;
  delete(id: number): Promise<void>;
  updateLoanAppExternalStatus(
    loan_id: number,
    status: StatusPengajuanEnum,
  ): Promise<void>;

  triggerBanding(loan_id: number, alasan_banding: string);
  triggerFinalLoanStatus(loan_id: number, status_akhir_pengajuan: string);

  //! ========== GENERAL ==========
  callSP_GENERAL_GetClientDatabaseExternal(
    page: number,
    page_size: number,
  ): Promise<{
    pagination: paginationInterface;
    ClientData: General_ClientDataInterface[];
    ClientHistoryLoanApplicationsData?: General_LoanApplicationDataInterface[];
  }>;

  callSP_GENERAL_GetLoanApplicationDatabase(
    page: number,
    page_size: number,
  ): Promise<{
    pagination: paginationInterface;
    LoanApplicationData: LoanApplicationSummary[];
  }>;

  callSP_GENERAL_GetAllPreviewDataLoanBySearch_External(
    role: RoleSearchEnum,
    type: TypeSearchEnum,
    keyword: string,
    page?: number,
    pageSize?: number,
  ): Promise<{ data: any[]; totalData: number; approvals?: any[] }>;

  //! ========== MARKETING ==========

  callSP_MKT_GetDashboard_External(
    marketingId: number,
  ): Promise<MarketingStats>;

  callSP_MKT_GetAllLoanApplications_External(
    marketingId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;

  callSP_MKT_GetAllRepeatOrderHistory_External(
    marketingId: number,
    page: number,
    page_size: number,
  ): Promise<{
    pagination: paginationInterface;
    ClientData: General_ClientDataInterface[];
    ClientHistoryLoanApplicationsData?: General_LoanApplicationDataInterface[];
  }>;

  callSP_MKT_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;

  //! ========== SUPERVISOR (SPV) ==========
  callSP_SPV_GetAllApprovalHistory_ByTeam(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_SPV_GetAllApprovalRequest_External(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_SPV_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
  callSP_SPV_GetAllTeams_External(supervisorId: number): Promise<any[]>;
  callSP_SPV_GetDashboard_External(
    supervisorId: number,
  ): Promise<SupervisorStats>;

  //!========== HEAD MARKETING (HM) ==========
  callSP_HM_GetAllApprovalHistory_External(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_HM_GetAllApprovalRequest_External(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_HM_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
  callSP_HM_GetAllTeams_External(hmId: number): Promise<any[]>;

  callSP_HM_GetAllUsers(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;

  //! ========== CREDIT ANALYST (CA) ==========
  callSP_CA_GetApprovalHistory_External(
    creditAnalystId: number,
    page: number,
    pageSize: number,
  ): Promise<{
    results: any;
    data: any[];
    total: number;
  }>;
  callSP_CA_GetAllApprovalRequest_External(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }>;
  callSP_CA_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]>;
  callSP_CA_GetDashboard_External(
    creditAnalystId: number,
  ): Promise<SupervisorStats>;
}
