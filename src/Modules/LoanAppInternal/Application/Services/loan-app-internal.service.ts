import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loanApp-internal.repository';
import { LoanApplicationInternal } from '../../Domain/Entities/loan-application-internal.entity';
import { CreateLoanApplicationInternalDto } from '../DTOS/dto-LoanApp/create-loan-application.dto';
import { UpdateLoanAplicationInternalDto } from '../DTOS/dto-LoanApp/update-loan-application.dto';
import {
  StatusPengajuanEnum,
  StatusPinjamanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';

@Injectable()
export class LoanApplicationInternalService {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly repo: ILoanApplicationInternalRepository,
  ) {}

  async create(
    dto: CreateLoanApplicationInternalDto,
  ): Promise<LoanApplicationInternal> {
    const now = new Date();
    const address = new LoanApplicationInternal(
      { id: dto.nasabah_id },
      dto.status_pinjaman ?? StatusPinjamanEnum.BARU,
      dto.nominal_pinjaman,
      dto.tenor,
      dto.keperluan,
      undefined,
      now,
      null,
      dto.status ?? StatusPengajuanEnum.PENDING,
      dto.pinjaman_ke,
      dto.riwayat_nominal,
      dto.riwayat_tenor,
      dto.sisa_pinjaman,
      dto.notes,
      dto.is_banding,
      dto.alasan_banding,
      now,
    );
    return this.repo.save(address);
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
              id_nasabah: row.id_nasabah,
              id_pengajuan: row.id_pengajuan,
              nominal_pinjaman: row.nominal_pinjaman,
              nama_nasabah: row.nama_nasabah,
              nama_marketing: row.marketing_nama,
              loan_status: row.loan_status,
              approval_status: row.approval_status,
              is_appealed: row.is_appealed,
              approve_response_date: row.approve_response_date,
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
              id_nasabah: row.id_nasabah,
              id_pengajuan: row.id_pengajuan,
              nominal_pinjaman: row.nominal_pinjaman,
              nama_nasabah: row.nama_nasabah,
              id_marketing: row.id_marketing,
              nama_supervisor: row.nama_supervisor,
              nama_marketing: row.marketing_nama,
              loan_app_status: row.loan_app_status,
              approval_status: row.approval_status,
              is_it_appeal: row.is_it_appeal,
              approve_response_date: row.approve_response_date,
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
                  const nameKey = `${roleKey}_name`;
                  const responseKey = `${roleKey}_response`;
                  const responseAtKey = `${roleKey}_response_at`;

                  status[roleKey] = {
                    [nameKey]: approval?.user_name || '-',
                    [responseKey]: approval?.response || '-',
                    [responseAtKey]: approval?.responded_at || '-',
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
                customer_id: loan.id_nasabah || null,
                customer_name: loan.nama_nasabah,
                loan_amount: rupiahFormatter.format(
                  Number(loan.nominal_pinjaman),
                ),
                loan_sequence: loan.loan_sequence,
                tenor: loan.tenor,
                approval_request_submitted_at: earliestTimestamp,
                approval_request_latest_responded_at: latestTimestamp,
                latest_loan_app_status: loan.loan_app_status,
                marketing_name: loan.marketing_nama,
                loan_application_status: loanApplicationStatus,
                loan_appeal_status: loanAppealStatus,
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
}
