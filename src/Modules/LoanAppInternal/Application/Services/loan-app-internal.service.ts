import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loanApp-internal.repository';
import { LoanApplicationInternal } from '../../Domain/Entities/loan-application-internal.entity';
import { CreateLoanApplicationInternalDto } from '../DTOS/dto-LoanApp/create-loan-application.dto';
import { UpdateLoanAplicationInternalDto } from '../DTOS/dto-LoanApp/update-loan-application.dto';
import {
  StatusPengajuanAkhirEnum,
  StatusPengajuanEnum,
  StatusPinjamanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';
import { LoanApplicationSummary } from 'src/Shared/Interface/General_ClientsDatabase/BankDataLoanApplication.interface';

@Injectable()
export class LoanApplicationInternalService {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly repo: ILoanApplicationInternalRepository,
  ) {}

  private buildApprovalRecommendation(row: any): any {
    const draftId = row.draft_id ?? null;
    const nominalPinjaman = Number(row.nominal_pinjaman ?? 0);
    const isLowAmount =
      !Number.isNaN(nominalPinjaman) && nominalPinjaman < 7000000;

    // Tidak ada draft_id
    if (!draftId) {
      if (isLowAmount) {
        return { dont_have_check: true };
      }
      return null;
    }

    // Ada draft_id
    const hasApprovalData = !!row.recommendation || !!row.filePath;

    if (hasApprovalData) {
      const approvalNominal = Number(row.approval_nominal_pinjaman ?? 0);
      const approvalIsLowAmount =
        !Number.isNaN(approvalNominal) && approvalNominal < 7000000;

      return {
        draft_id: draftId,
        nama_nasabah: row.nama_nasabah ?? '-',
        recommendation: row.recommendation ?? null,
        filePath: row.filePath ?? null,
        catatan: row.catatan ?? null,
        last_updated: row.last_updated ?? null,
        isNeedCheck: row.is_need_check ?? false,
        dont_have_check: approvalIsLowAmount,
      };
    } else if (isLowAmount) {
      // Ada draft tapi belum ada approval, dan nominal < 7jt
      return {
        draft_id: draftId,
        isNeedCheck: row.is_need_check ?? false,
        dont_have_check: true,
      };
    } else {
      // Ada draft tapi belum ada approval, dan nominal >= 7jt
      return {
        draft_id: draftId,
        isNeedCheck: row.is_need_check ?? false,
        recommendation: null,
      };
    }
  }

  async create(
    dto: CreateLoanApplicationInternalDto,
  ): Promise<LoanApplicationInternal> {
    const now = new Date();
    const loanApplication = new LoanApplicationInternal(
      { id: dto.nasabah_id },
      dto.status_pinjaman ?? StatusPinjamanEnum.BARU,
      dto.nominal_pinjaman,
      dto.tenor,
      dto.keperluan,
      undefined,
      now,
      null,
      dto.status ?? StatusPengajuanEnum.PENDING,
      dto.status_akhir_pengajuan ?? StatusPengajuanAkhirEnum.DONE,
      dto.pinjaman_ke,
      dto.riwayat_nominal,
      dto.riwayat_tenor,
      dto.sisa_pinjaman,
      dto.notes,
      dto.is_banding,
      dto.alasan_banding,
      dto.draft_id,
      now,
    );
    return this.repo.save(loanApplication);
  }

  async update(
    id: number,
    dto: UpdateLoanAplicationInternalDto,
  ): Promise<LoanApplicationInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanApplicationInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<LoanApplicationInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async searchLoans(
    role: RoleSearchEnum,
    type: TypeSearchEnum,
    keyword: string,
    page?: number | null,
    pageSize?: number | null,
  ): Promise<{
    results: any[];
    page: number;
    pageSize: number;
    total: number;
  }> {
    const sanitizedPage = page && page > 0 ? page : 1;
    const sanitizedPageSize = pageSize && pageSize > 0 ? pageSize : 10;

    const result =
      await this.repo.callSP_GENERAL_GetAllPreviewDataLoanBySearch_Internal(
        role,
        type,
        keyword,
        sanitizedPage,
        sanitizedPageSize,
      );

    let mappedData: any[] = [];
    console.log('result SP:', result);

    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });

    switch (role) {
      case RoleSearchEnum.MARKETING:
        switch (type) {
          case TypeSearchEnum.HISTORY:
            mappedData = result.data.map((row: any) => ({
              clientId: row.clientId,
              loanAppId: Number(row.loanAppId),
              nominal_pinjaman: Number(row.nominal_pinjaman),
              tenor: row.tenor,
              nama_lengkap: row.nama_lengkap,
              status: row.status,
            }));
            break;

          default:
            mappedData = result.data;
        }
        break;

      case RoleSearchEnum.SPV:
        switch (type) {
          case TypeSearchEnum.HISTORY:
            mappedData = result.data.map((row: any) => ({
              id_pengajuan: row.id_pengajuan,
              id_nasabah: row.id_nasabah,
              nama_nasabah: row.nama_nasabah,
              nominal_pinjaman: row.nominal_pinjaman,
              id_marketing: row.id_marketing,
              nama_marketing: row.marketing_nama, // Dari SP: marketing_nama
              loan_status: row.loan_status,
              loan_submitted_at: row.loan_submitted_at,
              approval_status: row.approval_status,
              is_appeal: row.is_appeal, // Dari SP: is_appeal (bukan is_appealed)
              reason_for_appeal: row.reason_for_appeal,
              approve_response_date: row.approve_response_date,
              approval_recommendation: this.buildApprovalRecommendation(row),
            }));
            break;

          case TypeSearchEnum.REQUEST:
            mappedData = result.data.map((row: any) => ({
              loanAppId: row.loanAppId,
              status: row.status,
            }));
            break;

          default:
            mappedData = result.data;
        }
        break;

      case RoleSearchEnum.CA:
        switch (type) {
          case TypeSearchEnum.HISTORY:
            mappedData = result.data.map((row: any) => ({
              id_pengajuan: row.id_pengajuan,
              id_nasabah: row.id_nasabah,
              nama_nasabah: row.nama_nasabah,
              nominal_pinjaman: row.nominal_pinjaman,
              id_marketing: row.id_marketing,
              nama_marketing: row.nama_marketing,
              nama_supervisor: row.nama_supervisor,
              payment_type: row.payment_type,
              approval_status: row.approval_status,
              loan_status: row.loan_status,
              loan_submitted_at: row.loan_submitted_at,
              approve_response_date: row.approve_response_date,
              is_it_appeal: row.is_it_appeal,
              is_need_survey: row.is_need_survey,
              approval_recommendation: this.buildApprovalRecommendation(row),
            }));
            break;

          case TypeSearchEnum.REQUEST:
            mappedData = result.data.map((row: any) => ({
              id_pengajuan: row.loan_id,
              nama_nasabah: row.nama_nasabah,
              tipe_nasabah: row.tipe_nasabah,
              nominal_pinjaman: row.nominal_pinjaman,
              nama_marketing: row.nama_marketing,
              nama_supervisor: row.nama_supervisor,
              is_has_survey: row.is_has_survey || null,
              status: row.status_pengajuan,
              loan_submitted_at: row.loan_submitted_at,
              approval_recommendation: this.buildApprovalRecommendation(row),
            }));
            break;

          default:
            mappedData = result.data;
        }
        break;

      case RoleSearchEnum.HM:
        switch (type) {
          case TypeSearchEnum.HISTORY:
            // Transform data untuk HM History dengan approval details
            mappedData = result.data.map((loan: any) => {
              // Filter approvals untuk loan ini
              const loanApprovals =
                result.approvals?.filter(
                  (app: any) => app.loan_id === loan.loan_id,
                ) || [];

              // Pisahkan approval normal (is_banding = 0) dan banding (is_banding = 1)
              const normalApprovals = loanApprovals.filter(
                (a: any) => a.is_banding === 0,
              );
              const bandingApprovals = loanApprovals.filter(
                (a: any) => a.is_banding === 1,
              );

              // Helper function untuk build approval object
              const buildApprovalStatus = (
                approvals: any[],
                roles: string[],
              ) => {
                const status: any = {};

                roles.forEach((role) => {
                  const approval = approvals.find((a: any) => a.role === role);
                  const roleKey =
                    role === 'supervisor'
                      ? 'spv'
                      : role === 'credit_analyst'
                        ? 'ca'
                        : role === 'head_marketing'
                          ? 'hm'
                          : role;

                  status[roleKey] = {
                    data: {
                      [`${roleKey}_name`]: approval?.user_name || '-',
                      [`${roleKey}_response`]: approval?.response || '-',
                      [`${roleKey}_approved_amount`]:
                        approval?.approval_amount ?? '-',
                      [`${roleKey}_approved_tenor`]:
                        approval?.approval_tenor ?? '-',
                      [`${roleKey}_response_at`]: approval?.responded_at || '-',
                    },
                  };
                });

                return status;
              };

              // Build loan application status (normal approvals)
              const loanApplicationStatus = buildApprovalStatus(
                normalApprovals,
                ['supervisor', 'credit_analyst', 'head_marketing'],
              );

              // Build loan appeal status (banding approvals)
              const loanAppealStatus = buildApprovalStatus(bandingApprovals, [
                'credit_analyst',
                'head_marketing',
              ]);

              // Get earliest and latest timestamps
              const allTimestamps = loanApprovals
                .filter((a: any) => a.responded_at)
                .map((a: any) => new Date(a.responded_at));

              const earliestTimestamp =
                allTimestamps.length > 0
                  ? new Date(Math.min(...allTimestamps.map((d) => d.getTime())))
                  : null;

              const latestTimestamp =
                allTimestamps.length > 0
                  ? new Date(Math.max(...allTimestamps.map((d) => d.getTime())))
                  : null;

              return {
                loan_id: Number(loan.loan_id),
                customer_id: loan.customer_id ? Number(loan.customer_id) : null,
                customer_name: loan.nama_nasabah,
                loan_amount: rupiahFormatter.format(
                  Number(loan.nominal_pinjaman),
                ),
                loan_sequence: loan.loan_sequence,
                tenor: loan.tenor,
                loan_submitted_at: loan.loan_submitted_at,
                approval_request_submitted_at: earliestTimestamp,
                approval_request_latest_responded_at: latestTimestamp,
                latest_loan_app_status: loan.loan_app_status,
                approval_status: loan.approval_status,
                approval_tenor: loan.approval_tenor,
                approval_amount: loan.approval_amount,
                is_banding: loan.is_banding ? Number(loan.is_banding) : 0,
                marketing_id: loan.marketing_id
                  ? Number(loan.marketing_id)
                  : null,
                marketing_name: loan.marketing_nama,
                supervisor_name: loan.supervisor_nama,
                loan_application_status: loanApplicationStatus,
                loan_appeal_status: loanAppealStatus,
                approval_recommendation: this.buildApprovalRecommendation(loan),
              };
            });
            break;

          case TypeSearchEnum.REQUEST:
            mappedData = result.data.map((row: any) => ({
              loanAppId: row.loanAppId,
              status: row.status,
            }));
            break;

          default:
            mappedData = result.data;
        }
        break;

      default:
        mappedData = result.data;
    }

    return {
      results: mappedData,
      page: sanitizedPage,
      pageSize: sanitizedPageSize,
      total: result.totalData,
    };
  }

  async getLoanApplicationInternalDatabase(
    page?: number | null,
    pageSize?: number | null,
  ): Promise<{
    results: LoanApplicationSummary[];
    page: number;
    pageSize: number;
    total: number;
  }> {
    const sanitizedPage = page && page > 0 ? page : 1;
    const sanitizedPageSize = pageSize && pageSize > 0 ? pageSize : 10;

    const result =
      await this.repo.callSP_GENERAL_GetLoanApplicationDatabase_Internal(
        sanitizedPage,
        sanitizedPageSize,
      );

    const mappedData = (result.LoanApplicationData || []).map((item) => ({
      ...item,
      id_pengajuan: Number(item.id_pengajuan),
    }));

    return {
      results: mappedData,
      page: sanitizedPage,
      pageSize: sanitizedPageSize,
      total: result.pagination?.total ?? 0,
    };
  }
}
