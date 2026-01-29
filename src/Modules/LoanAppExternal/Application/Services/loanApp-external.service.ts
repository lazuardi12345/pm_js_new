import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loanApp-external.repository';
import { LoanApplicationExternal } from '../../Domain/Entities/loanApp-external.entity';
import { CreateLoanApplicationExternalDto } from '../DTOS/dto-Loan-Application/create-loan-application.dto';
import { UpdateLoanApplicationExternalDto } from '../DTOS/dto-Loan-Application/update-loan-application.dto';
import {
  ApprovalDetail,
  LoanApplicationSummary,
  SurveyorResult,
} from 'src/Shared/Interface/General_ClientsDatabase/BankDataLoanApplication.interface';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';

@Injectable()
export class LoanApplicationExternalService {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly repo: ILoanApplicationExternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendationRepo: IApprovalRecommendationRepository,
  ) {}

  async create(
    dto: CreateLoanApplicationExternalDto,
  ): Promise<LoanApplicationExternal> {
    const now = new Date();

    const entity = new LoanApplicationExternal(
      { id: dto.nasabah_id },
      dto.jenis_pembiayaan,
      dto.nominal_pinjaman,
      dto.tenor,
      dto.berkas_jaminan,
      dto.status_pinjaman,
      undefined,
      dto.pinjaman_ke,
      dto.pinjaman_terakhir,
      dto.sisa_pinjaman,
      dto.realisasi_pinjaman,
      dto.cicilan_perbulan,
      dto.status_pengajuan,
      dto.status_pengajuan_akhir,
      dto.validasi_pengajuan,
      dto.catatan_spv,
      dto.catatan_marketing,
      dto.is_banding,
      dto.alasan_banding,
      dto.survey_schedule,
      dto.draft_id,
      now,
      now,
      null,
    );

    return this.repo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateLoanApplicationExternalDto,
  ): Promise<LoanApplicationExternal> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Loan Application with ID ${id} not found`);
    }

    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanApplicationExternal> {
    const data = await this.repo.findById(id);
    if (!data) {
      throw new NotFoundException(`Loan Application with ID ${id} not found`);
    }
    return data;
  }

  async findAll(): Promise<LoanApplicationExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Loan Application with ID ${id} not found`);
    }
    return this.repo.delete(id);
  }

  async searchLoans(
    role: RoleSearchEnum,
    type: TypeSearchEnum,
    paymentType: JenisPembiayaanEnum | null,
    keyword: string,
    page?: number | null,
    pageSize?: number | null,
  ): Promise<{
    payload: {
      error: boolean;
      message?: string;
      reference: string;
      data: {
        results: any[];
      };
      page: number;
      pageSize: number;
      total: number;
    };
  }> {
    const sanitizedPage = page && page > 0 ? page : 1;
    const sanitizedPageSize = pageSize && pageSize > 0 ? pageSize : 10;

    console.log(
      'Puki mak kau hijau',
      role,
      type,
      paymentType,
      keyword,
      sanitizedPage,
      sanitizedPageSize,
    );

    const result =
      await this.repo.callSP_GENERAL_GetAllPreviewDataLoanBySearch_External(
        role,
        type,
        paymentType,
        keyword,
        sanitizedPage,
        sanitizedPageSize,
      );

    let mappedData: any[] = [];
    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });

    const draftIds = result.data
      .map((item: any) => item?.draft_id)
      .filter((draftId): draftId is string => !!draftId);

    // Ambil semua recommendations parallel
    const recMap = new Map<string, any>();
    if (draftIds.length > 0) {
      const recs = await Promise.all(
        draftIds.map((draftId) =>
          this.approvalRecommendationRepo.findByDraftId(draftId),
        ),
      );
      recs.forEach((rec, i) => {
        if (rec) recMap.set(draftIds[i], rec);
      });
    }

    switch (role) {
      case RoleSearchEnum.MARKETING:
        switch (type) {
          case TypeSearchEnum.HISTORY:
            mappedData = result.data.map((item: any) => {
              const loanAmountFormatted = item?.nominal_pinjaman
                ? rupiahFormatter.format(Number(item.nominal_pinjaman))
                : '-';
              const lastApprovedAmountFormatted = item?.last_approval_nominal
                ? rupiahFormatter.format(Number(item.last_approval_nominal))
                : '-';
              const approvalRecommendation = item?.draft_id
                ? recMap.get(item.draft_id) || null
                : null;

              return {
                loan_id: Number(item?.loan_id ?? 0),
                customer_id: Number(item?.customer_id ?? 0),
                customer_name: item?.nama_lengkap ?? '-',
                customer_type: item?.customer_type ?? '-',
                loan_amount: loanAmountFormatted,
                loan_sequence: item?.pinjaman_ke ?? '-',
                tenor: item?.tenor ?? '-',
                loan_submitted_at: item?.created_at ?? '-',
                latest_loan_status: item?.status_pengajuan ?? '-',
                final_loan_status: item?.status_pengajuan_akhir ?? '-',
                marketing_name: item?.marketing_name ?? '-',
                approval_recommendation: approvalRecommendation,
                loan_application_status: {
                  spv: {
                    data: {
                      spv_name: item?.spv_app_name ?? '-',
                      spv_response: item?.spv_app_status ?? '-',
                      spv_approved_amount: item?.spv_app_amount ?? '-',
                      spv_approved_tenor: item?.spv_app_tenor ?? '-',
                      spv_response_at: item?.spv_app_response_at ?? '-',
                    },
                  },
                  svy: {
                    data: {
                      svy_visited_person: item?.survey_berjumpa_siapa ?? '-',
                      svy_visited_time: item?.survey_created_at ?? '-',
                    },
                  },
                  ca: {
                    data: {
                      ca_name: item?.ca_app_name ?? '-',
                      ca_response: item?.ca_app_status ?? '-',
                      ca_approved_amount: item?.ca_app_amount ?? '-',
                      ca_approved_tenor: item?.ca_app_tenor ?? '-',
                      ca_response_at: item?.ca_app_response_at ?? '-',
                    },
                  },
                  hm: {
                    data: {
                      hm_name: item?.hm_app_name ?? '-',
                      hm_response: item?.hm_app_status ?? '-',
                      hm_approved_amount: item?.hm_app_amount ?? '-',
                      hm_approved_tenor: item?.hm_app_tenor ?? '-',
                      hm_response_at: item?.hm_app_response_at ?? '-',
                    },
                  },
                },
                loan_appeal_status: {
                  hm: {
                    data: {
                      hm_name: item?.hm_appeal_name ?? '-',
                      hm_response: item?.hm_appeal_status ?? '-',
                      hm_approved_amount: item?.hm_appeal_amount ?? '-',
                      hm_approved_tenor: item?.hm_appeal_tenor ?? '-',
                      hm_response_at: item?.hm_appeal_response_at ?? '-',
                    },
                  },
                },
                last_approved_amount: lastApprovedAmountFormatted,
                last_approved_tenor: Number(item?.last_approval_tenor ?? 0),
              };
            });
            break;
        }
        break;

      case RoleSearchEnum.SPV:
        switch (type) {
          case TypeSearchEnum.HISTORY:
            mappedData = result.data.map((row: any) => ({
              id_nasabah: row.id_nasabah,
              id_pengajuan: row.id_pengajuan,
              nominal_pinjaman: rupiahFormatter.format(
                Number(row.nominal_pinjaman),
              ),
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
              id_pengajuan: row.loan_id,
              nama_nasabah: row.nama_nasabah,
              tipe_nasabah: 'reguler',
              nominal_pinjaman: rupiahFormatter.format(
                Number(row.nominal_pinjaman),
              ),
              jenis_pembiayaan: row.jenis_pembiayaan,
              nama_marketing: row.marketing_nama,
              status: row.loan_app_status,
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
              nominal_pinjaman: rupiahFormatter.format(
                Number(row.nominal_pinjaman),
              ),
              nama_nasabah: row.nama_nasabah,
              id_marketing: row.id_marketing,
              nama_supervisor: row.nama_supervisor,
              nama_marketing: row.marketing_nama,
              loan_app_status: row.loan_app_status,
              approval_status: row.approval_status,
              approval_tenor: row.approval_tenor,
              approval_amount: row.approval_amount,
              is_it_appeal: row.is_it_appeal,
              approve_response_date: row.approve_response_date,
            }));
            break;

          case TypeSearchEnum.REQUEST:
            mappedData = result.data.map((row: any) => ({
              id_pengajuan: row.loan_id,
              nama_nasabah: row.nama_nasabah,
              tipe_nasabah: 'reguler',
              jenis_pembiayaan: row.jenis_pembiayaan,
              nominal_pinjaman: rupiahFormatter.format(
                Number(row.nominal_pinjaman),
              ),
              nama_marketing: row.marketing_nama,
              nama_supervisor: row.supervisor_nama,
              is_has_survey: row.is_has_survey,
              status: row.loan_app_status,
            }));
            break;

          default:
            mappedData = result.data;
        }
        break;

      case RoleSearchEnum.HM:
        switch (type) {
          // HEAD MARKETING - HISTORY MAPPING
          case TypeSearchEnum.HISTORY:
            mappedData = result.data.map((item: any) => {
              // Format currency
              const loanAmountFormatted = item?.nominal_pinjaman
                ? rupiahFormatter.format(Number(item.nominal_pinjaman))
                : '-';

              const lastApprovedAmountFormatted = item?.last_approval_nominal
                ? rupiahFormatter.format(Number(item.last_approval_nominal))
                : '-';

              // Get approval recommendation from draft_id
              const approvalRecommendation = item?.draft_id
                ? recMap.get(item.draft_id) || null
                : null;

              // Build loan application status (APP - is_banding = 0)
              const loanApplicationStatus = {
                spv: {
                  data: {
                    spv_name: item?.spv_app_name ?? '-',
                    spv_response: item?.spv_app_status ?? '-',
                    spv_approved_amount: item?.spv_app_amount
                      ? rupiahFormatter.format(Number(item.spv_app_amount))
                      : '-',
                    spv_approved_tenor: item?.spv_app_tenor ?? '-',
                    spv_response_at: item?.spv_app_response_at ?? '-',
                  },
                },
                svy: {
                  data: {
                    svy_visited_person: item?.survey_berjumpa_siapa ?? '-',
                    svy_visited_time: item?.survey_created_at ?? '-',
                  },
                },
                ca: {
                  data: {
                    ca_name: item?.ca_app_name ?? '-',
                    ca_response: item?.ca_app_status ?? '-',
                    ca_approved_amount: item?.ca_app_amount
                      ? rupiahFormatter.format(Number(item.ca_app_amount))
                      : '-',
                    ca_approved_tenor: item?.ca_app_tenor ?? '-',
                    ca_response_at: item?.ca_app_response_at ?? '-',
                  },
                },
                hm: {
                  data: {
                    hm_name: item?.hm_app_name ?? '-',
                    hm_response: item?.hm_app_status ?? '-',
                    hm_approved_amount: item?.hm_app_amount
                      ? rupiahFormatter.format(Number(item.hm_app_amount))
                      : '-',
                    hm_approved_tenor: item?.hm_app_tenor ?? '-',
                    hm_response_at: item?.hm_app_response_at ?? '-',
                  },
                },
              };

              // Build loan appeal status (APPEAL - is_banding = 1)
              const loanAppealStatus = {
                ca: {
                  data: {
                    ca_name: item?.ca_appeal_name ?? '-',
                    ca_response: item?.ca_appeal_status ?? '-',
                    ca_approved_amount: item?.ca_appeal_amount
                      ? rupiahFormatter.format(Number(item.ca_appeal_amount))
                      : '-',
                    ca_approved_tenor: item?.ca_appeal_tenor ?? '-',
                    ca_response_at: item?.ca_appeal_response_at ?? '-',
                  },
                },
                spv: {
                  data: {
                    spv_name: item?.spv_appeal_name ?? '-',
                    spv_response: item?.spv_appeal_status ?? '-',
                    spv_approved_amount: item?.spv_appeal_amount
                      ? rupiahFormatter.format(Number(item.spv_appeal_amount))
                      : '-',
                    spv_approved_tenor: item?.spv_appeal_tenor ?? '-',
                    spv_response_at: item?.spv_appeal_response_at ?? '-',
                  },
                },
                hm: {
                  data: {
                    hm_name: item?.hm_appeal_name ?? '-',
                    hm_response: item?.hm_appeal_status ?? '-',
                    hm_approved_amount: item?.hm_appeal_amount
                      ? rupiahFormatter.format(Number(item.hm_appeal_amount))
                      : '-',
                    hm_approved_tenor: item?.hm_appeal_tenor ?? '-',
                    hm_response_at: item?.hm_appeal_response_at ?? '-',
                  },
                },
              };

              // Calculate earliest & latest timestamps from all approvals
              const allTimestamps: Date[] = [];

              // Collect APP timestamps
              if (
                item?.spv_app_response_at &&
                item.spv_app_response_at !== '-'
              ) {
                allTimestamps.push(new Date(item.spv_app_response_at));
              }
              if (item?.ca_app_response_at && item.ca_app_response_at !== '-') {
                allTimestamps.push(new Date(item.ca_app_response_at));
              }
              if (item?.hm_app_response_at && item.hm_app_response_at !== '-') {
                allTimestamps.push(new Date(item.hm_app_response_at));
              }

              // Collect APPEAL timestamps
              if (
                item?.ca_appeal_response_at &&
                item.ca_appeal_response_at !== '-'
              ) {
                allTimestamps.push(new Date(item.ca_appeal_response_at));
              }
              if (
                item?.spv_appeal_response_at &&
                item.spv_appeal_response_at !== '-'
              ) {
                allTimestamps.push(new Date(item.spv_appeal_response_at));
              }
              if (
                item?.hm_appeal_response_at &&
                item.hm_appeal_response_at !== '-'
              ) {
                allTimestamps.push(new Date(item.hm_appeal_response_at));
              }

              const earliestTimestamp =
                allTimestamps.length > 0
                  ? new Date(Math.min(...allTimestamps.map((d) => d.getTime())))
                  : null;

              const latestTimestamp =
                allTimestamps.length > 0
                  ? new Date(Math.max(...allTimestamps.map((d) => d.getTime())))
                  : null;

              return {
                // Basic loan info
                loan_id: Number(item?.loan_id ?? 0),
                customer_id: Number(item?.client_id ?? 0),
                customer_name: item?.nama_lengkap ?? '-',
                customer_nik: item?.nik ?? '-',
                loan_amount: loanAmountFormatted,
                loan_sequence: item?.pinjaman_ke ?? '-',
                tenor: item?.tenor ?? '-',
                jenis_pembiayaan: item?.jenis_pembiayaan ?? '-',

                // Timestamps
                loan_submitted_at: item?.created_at ?? '-',
                approval_request_submitted_at: earliestTimestamp,
                approval_request_latest_responded_at: latestTimestamp,

                // Loan status
                latest_loan_status: item?.status_pengajuan ?? '-',
                final_loan_status: item?.final_loan_status ?? '-',

                // Marketing info
                marketing_name: item?.marketing_nama ?? '-',

                // Survey info
                survey_id: item?.survey_id ?? null,

                // Last approval info
                last_approved_amount: lastApprovedAmountFormatted,
                last_approved_tenor: Number(item?.last_approval_tenor ?? 0),
                last_approval_role: item?.last_approval_role ?? '-',

                // Approval recommendation
                approval_recommendation: approvalRecommendation,

                // Detailed approval statuses
                loan_application_status: loanApplicationStatus,
                loan_appeal_status: loanAppealStatus,

                // HM specific info
                hm_is_banding: item?.hm_is_banding ?? 0,
                hm_latest_response_at: item?.hm_latest_response_at ?? '-',
              };
            });
            break;
          case TypeSearchEnum.REQUEST:
            mappedData = result.data.map((row: any) => ({
              pengajuan_id: row.pengajuan_id,
              id_nasabah: row.id_nasabah,
              nama_nasabah: row.nama_nasabah,
              tipe_nasabah: 'reguler',
              pinjaman_ke: row.pinjaman_ke,
              nominal_pinjaman: row.nominal_pinjaman,
              tenor: row.tenor,
              id_marketing: row.id_marketing,
              nama_marketing: row.nama_marketing,
              nama_supervisor: row.nama_supervisor,
              waktu_pengajuan: row.waktu_pengajuan,
              status_loan: row.status_loan,
              perusahaan: row.perusahaan,
              is_banding: row.is_banding,
              is_has_survey: row.is_has_survey,
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
      payload: {
        error: false,
        message: 'Search was successfully retrieved',
        reference: 'SEARCH_RETRIEVE_OK',
        data: {
          results: mappedData,
        },
        page: sanitizedPage,
        pageSize: sanitizedPageSize,
        total: Number(result.totalData),
      },
    };
  }

  async getLoanApplicationExternalDatabase(
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

    const result = await this.repo.callSP_GENERAL_GetLoanApplicationDatabase(
      sanitizedPage,
      sanitizedPageSize,
    );

    const mapApprovalDetail = (item: any, prefix: string): ApprovalDetail => ({
      name: item[`${prefix}_name`] || null,
      status: item[`${prefix}_status`] || null,
      approval_status: item[`${prefix}_approval_status`] || '',
      response_at: item[`${prefix}_response_at`]
        ? new Date(item[`${prefix}_response_at`])
        : null,
      approved_amount: item[`${prefix}_approved_amount`]
        ? Number(item[`${prefix}_approved_amount`])
        : null,
      approved_tenor: item[`${prefix}_approved_tenor`]
        ? Number(item[`${prefix}_approved_tenor`])
        : null,
      keterangan: item[`${prefix}_keterangan`] || '',
    });

    const mapSurveyResult = (item: any, prefix: string): SurveyorResult => ({
      visited_person: item[`${prefix}_visited_person`] || null,
      visited_time: item[`${prefix}_visited_time`] || null,
    });

    const mappedData = (result.LoanApplicationData || []).map((item) => ({
      // ===================================
      // DATA LOAN APPLICATION
      // ===================================
      loan_id: Number(item.loan_id),
      id_pengajuan: Number(item.id_pengajuan),
      customer_id: Number(item.customer_id),
      customer_name: item.customer_name,
      nama_nasabah: item.nama_nasabah,
      loan_amount: Number(item.loan_amount),
      nominal_pinjaman: Number(item.nominal_pinjaman),
      pinjaman_ke: Number(item.pinjaman_ke),
      tenor: Number(item.tenor),
      jenis_pembiayaan: item.jenis_pembiayaan,
      approval_request_submitted_at: item.approval_request_submitted_at,
      created_at: item.created_at,
      approval_request_responded_at: item.approval_request_responded_at,
      latest_loan_app_status: item.latest_loan_app_status,
      status_pengajuan: item.status_pengajuan,
      final_status: item.final_status,
      marketing_name: item.marketing_name,

      loan_application_status: {
        spv: mapApprovalDetail(item, 'spv_app'),
        svy: mapSurveyResult(item, 'svy_app'),
        ca: mapApprovalDetail(item, 'ca_app'),
        hm: mapApprovalDetail(item, 'hm_app'),
      },
      loan_appeal_status: {
        ca: mapApprovalDetail(item, 'ca_appeal'),
        hm: mapApprovalDetail(item, 'hm_appeal'),
      },
    }));

    return {
      results: mappedData,
      page: sanitizedPage,
      pageSize: sanitizedPageSize,
      total: result.pagination?.total ?? 0,
    };
  }
}
