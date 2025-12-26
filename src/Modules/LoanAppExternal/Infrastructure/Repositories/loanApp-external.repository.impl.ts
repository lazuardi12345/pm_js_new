import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplicationExternal } from '../../Domain/Entities/loanApp-external.entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';
import { ILoanApplicationExternalRepository } from '../../Domain/Repositories/loanApp-external.repository';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';
import {
  JenisPembiayaanEnum,
  StatusPengajuanAkhirEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';
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
import { ClientDetailForSurveyData } from 'src/Shared/Interface/SVY_ClientDetails/ClientDetails.interface';
import { HistorySurveyExternalData } from 'src/Shared/Interface/SVY_SurveyHistory/SVY_SurveyHistory.interface';

@Injectable()
export class LoanApplicationExternalRepositoryImpl
  implements ILoanApplicationExternalRepository
{
  dataSource: any;
  db: any;
  constructor(
    @InjectRepository(LoanApplicationExternal_ORM_Entity)
    private readonly ormRepository: Repository<LoanApplicationExternal_ORM_Entity>,
  ) {}

  private toDomain(
    orm: LoanApplicationExternal_ORM_Entity,
  ): LoanApplicationExternal {
    return new LoanApplicationExternal(
      { id: orm.nasabah.id },
      orm.jenis_pembiayaan,
      Number(orm.nominal_pinjaman),
      orm.tenor,
      orm.berkas_jaminan,
      orm.status_pinjaman,
      orm.id,
      orm.pinjaman_ke,
      orm.pinjaman_terakhir ? Number(orm.pinjaman_terakhir) : undefined,
      orm.sisa_pinjaman ? Number(orm.sisa_pinjaman) : undefined,
      orm.realisasi_pinjaman,
      orm.cicilan_perbulan ? Number(orm.cicilan_perbulan) : undefined,
      orm.status_pengajuan,
      orm.status_pengajuan_akhir,
      orm.validasi_pengajuan,
      orm.catatan_spv,
      orm.catatan_marketing,
      orm.is_banding,
      orm.alasan_banding,
      orm.survey_schedule,
      orm.draft_id,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domain: LoanApplicationExternal,
  ): Partial<LoanApplicationExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabah.id } as ClientExternal_ORM_Entity,
      jenis_pembiayaan: domain.jenis_pembiayaan,
      nominal_pinjaman: domain.nominal_pinjaman,
      tenor: domain.tenor,
      berkas_jaminan: domain.berkas_jaminan,
      status_pinjaman: domain.status_pinjaman,
      pinjaman_ke: domain.pinjaman_ke,
      pinjaman_terakhir: domain.pinjaman_terakhir,
      sisa_pinjaman: domain.sisa_pinjaman,
      realisasi_pinjaman: domain.realisasi_pinjaman,
      cicilan_perbulan: domain.cicilan_perbulan,
      status_pengajuan: domain.status_pengajuan,
      validasi_pengajuan: domain.validasi_pengajuan,
      catatan_spv: domain.catatan_spv,
      catatan_marketing: domain.catatan_marketing,
      is_banding: domain.is_banding,
      alasan_banding: domain.alasan_banding,
      survey_schedule: domain.survey_schedule,
      draft_id: domain.draft_id,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<LoanApplicationExternal>,
  ): Partial<LoanApplicationExternal_ORM_Entity> {
    const orm: Partial<LoanApplicationExternal_ORM_Entity> = {};

    if (partial.nasabah?.id)
      orm.nasabah = { id: partial.nasabah.id } as ClientExternal_ORM_Entity;
    if (partial.jenis_pembiayaan)
      orm.jenis_pembiayaan = partial.jenis_pembiayaan;
    if (partial.nominal_pinjaman !== undefined)
      orm.nominal_pinjaman = partial.nominal_pinjaman;
    if (partial.tenor !== undefined) orm.tenor = partial.tenor;
    if (partial.berkas_jaminan) orm.berkas_jaminan = partial.berkas_jaminan;
    if (partial.status_pinjaman) orm.status_pinjaman = partial.status_pinjaman;
    if (partial.pinjaman_ke !== undefined)
      orm.pinjaman_ke = partial.pinjaman_ke;
    if (partial.pinjaman_terakhir !== undefined)
      orm.pinjaman_terakhir = partial.pinjaman_terakhir;
    if (partial.sisa_pinjaman !== undefined)
      orm.sisa_pinjaman = partial.sisa_pinjaman;
    if (partial.realisasi_pinjaman)
      orm.realisasi_pinjaman = partial.realisasi_pinjaman;
    if (partial.cicilan_perbulan !== undefined)
      orm.cicilan_perbulan = partial.cicilan_perbulan;
    if (partial.status_pengajuan)
      orm.status_pengajuan = partial.status_pengajuan;
    if (partial.validasi_pengajuan !== undefined)
      orm.validasi_pengajuan = partial.validasi_pengajuan;
    if (partial.catatan_spv) orm.catatan_spv = partial.catatan_spv;
    if (partial.catatan_marketing)
      orm.catatan_marketing = partial.catatan_marketing;
    if (partial.is_banding !== undefined) orm.is_banding = partial.is_banding;
    if (partial.alasan_banding) orm.alasan_banding = partial.alasan_banding;
    if (partial.survey_schedule) orm.survey_schedule = partial.survey_schedule;
    if (partial.draft_id) orm.draft_id = partial.draft_id;
    if (partial.created_at) orm.created_at = partial.created_at;
    if (partial.updated_at) orm.updated_at = partial.updated_at;
    if (partial.deleted_at) orm.deleted_at = partial.deleted_at;

    return orm;
  }

  async findById(id: number): Promise<LoanApplicationExternal | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<LoanApplicationExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<LoanApplicationExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async save(data: LoanApplicationExternal): Promise<LoanApplicationExternal> {
    const saved = await this.ormRepository.save(this.toOrm(data));
    return this.toDomain(saved as LoanApplicationExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<LoanApplicationExternal>,
  ): Promise<LoanApplicationExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('LoanApplicationExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async updateLoanAppExternalStatus(
    loan_id: number,
    status: StatusPengajuanEnum,
  ): Promise<void> {
    await this.ormRepository.update(
      { id: loan_id },
      { status_pengajuan: status },
    );
  }

  async triggerBanding(loan_id: number, alasan_banding: string): Promise<void> {
    const now = new Date();
    await this.ormRepository.update(
      { id: loan_id },
      {
        status_pengajuan: StatusPengajuanEnum.BANDING,
        is_banding: true,
        alasan_banding: alasan_banding,
        updated_at: now,
      },
    );
  }

  async triggerFinalLoanStatus(
    loan_id: number,
    status: StatusPengajuanAkhirEnum.CLOSED | StatusPengajuanAkhirEnum.DONE,
  ): Promise<void> {
    const now = new Date();

    if (
      ![
        StatusPengajuanAkhirEnum.CLOSED,
        StatusPengajuanAkhirEnum.DONE,
      ].includes(status)
    ) {
      throw new Error('Invalid status for final loan status trigger');
    }

    await this.ormRepository.update(
      { id: loan_id },
      {
        status_pengajuan_akhir: status,
        updated_at: now,
      },
    );
  }

  //! ========== GENERAL ==========

  async callSP_GENERAL_GetAllPreviewDataLoanBySearch_External(
    role: RoleSearchEnum,
    type: TypeSearchEnum,
    keyword: string,
    page?: number,
    pageSize?: number,
  ): Promise<{ data: any[]; totalData: any; approvals?: any[] }> {
    console.log(
      'CALL SP with params > : ',
      keyword,
      role,
      type,
      page,
      pageSize,
    );

    const result = await this.ormRepository.manager.query(
      'CALL GENERAL_GetAllPreviewDataLoanBySearch_External(?, ?, ?, ?, ?)',
      [keyword, role, type, page, pageSize],
    );
    const totalData = result[0][0].total;
    const data = result[1] || [];

    // Gabungkan approvals hanya untuk head_marketing (yang punya 4+ result sets)
    const approvals =
      role === 'head_marketing' && result.length >= 4
        ? [...(result[2] || []), ...(result[3] || [])].sort((a, b) =>
            a.loan_id !== b.loan_id
              ? Number(a.loan_id) - Number(b.loan_id)
              : new Date(a.responded_at).getTime() -
                new Date(b.responded_at).getTime(),
          )
        : undefined;

    console.log('totalData:', totalData);
    approvals && console.log('approvals count:', approvals.length);

    return role === 'head_marketing'
      ? { data, totalData, approvals }
      : { data, totalData };
  }

  async callSP_GENERAL_GetClientDatabaseExternal(
    page: number,
    page_size: number,
  ): Promise<{
    pagination: paginationInterface;
    ClientData: General_ClientDataInterface[];
    ClientHistoryLoanApplicationsData: General_LoanApplicationDataInterface[];
  }> {
    const ormEntities = this.ormRepository.manager;

    // result sets: [pagination, client data, loan data]
    const [paginationResult, clientResult, loanResult] =
      await ormEntities.query(`CALL GENERAL_ClientDatabase(?, ?)`, [
        page,
        page_size,
      ]);

    const pagination: paginationInterface = paginationResult?.[0]
      ? {
          total: Number(paginationResult[0].total),
          page: Number(paginationResult[0].page),
          page_size: Number(paginationResult[0].page_size),
        }
      : { total: 0, page, page_size };

    return {
      pagination,
      ClientData: clientResult || [],
      ClientHistoryLoanApplicationsData: loanResult || [],
    };
  }

  async callSP_GENERAL_GetLoanApplicationDatabase(
    page: number,
    page_size: number,
  ): Promise<{
    pagination: paginationInterface;
    LoanApplicationData: LoanApplicationSummary[];
  }> {
    const ormEntities = this.ormRepository.manager;

    // result sets: [pagination, client data, loan data]
    const [loanResult, paginationResult] = await ormEntities.query(
      `CALL GENERAL_GetLoanApplicationDatabase(?, ?)`,
      [page, page_size],
    );

    const pagination: paginationInterface = paginationResult?.[0]
      ? {
          total: Number(paginationResult[0].total),
          page: Number(paginationResult[0].page),
          page_size: Number(paginationResult[0].page_size),
        }
      : { total: 0, page, page_size };

    return {
      pagination,
      LoanApplicationData: loanResult || [],
    };
  }

  //! ========== MKT ==========
  async callSP_MKT_GetAllLoanApplications_External(
    marketingId: number,
    page: number,
    pageSize: number,
    paymentType: JenisPembiayaanEnum,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;

    const result = await ormEntities.query(
      `CALL MKT_GetAllLoanApplicationsByPaymentType_External(?, ?, ?, ?);`,
      [marketingId, page, pageSize, paymentType],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_MKT_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL MKT_GetLoanApplicationById_External(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_MKT_GetAllRepeatOrderHistory_External(
    marketingId: number,
    page: number,
    page_size: number,
  ): Promise<{
    pagination: paginationInterface;
    ClientData: General_ClientDataInterface[];
    ClientHistoryLoanApplicationsData: General_LoanApplicationDataInterface[];
  }> {
    const ormEntities = this.ormRepository.manager;

    console.log(marketingId, page, page_size);
    // result sets: [pagination, client data, loan data]
    const [paginationResult, clientResult, loanResult] =
      await ormEntities.query(
        `CALL MKT_GetAllRepeatOrderHistory_External(?, ?, ?)`,
        [marketingId, page, page_size],
      );

    console.log(paginationResult, clientResult, loanResult);

    const pagination: paginationInterface = paginationResult?.[0]
      ? {
          total: Number(paginationResult[0].total),
          page: Number(paginationResult[0].page),
          page_size: Number(paginationResult[0].page_size),
        }
      : { total: 0, page, page_size };

    return {
      pagination,
      ClientData: clientResult || [],
      ClientHistoryLoanApplicationsData: loanResult || [],
    };
  }

  async callSP_MKT_GetDashboard_External(
    marketingId: number,
  ): Promise<MarketingStats> {
    const results: MarketingStats = await this.ormRepository.manager.query(
      `CALL MKT_GetDashboardStats(?)`,
      [marketingId],
    );

    console.log(results[0][0]);
    return results[0][0];
  }

  //! ========== SPV ==========
  async callSP_SPV_GetAllApprovalHistory_ByTeam(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(
      `CALL SPV_GetApprovalHistoryByTeams_External(?, ?, ?);`,
      [supervisorId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_SPV_GetAllApprovalRequest_External(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(
      `CALL SPV_GetAllApprovalRequest_External(?, ?, ?);`,
      [supervisorId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_SPV_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL SPV_GetLoanApplicationById_External(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_SPV_GetAllTeams_External(supervisorId: number): Promise<any[]> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(`CALL SPV_GetAllTeams_External(?)`, [
      supervisorId,
    ]);
    return result[0];
  }

  async callSP_SPV_GetDashboard_External(
    supervisorId: number,
  ): Promise<SupervisorStats> {
    const results: SupervisorStats = await this.ormRepository.manager.query(
      `CALL SPV_GetDashboardStats(?)`,
      [supervisorId],
    );

    console.log(results[0][0]);
    return results[0][0];
  }

  //! ========== CA ==========
  async callSP_CA_GetApprovalHistory_External(
    creditAnalystId: number,
    page: number,
    pageSize: number,
  ): Promise<{
    results: any[];
    data: any[];
    total: number;
  }> {
    // Misal kamu punya repository/ORM yang bisa langsung akses query
    const result = await this.ormRepository.manager.query(
      'CALL CA_GetApprovalHistory_External(?, ?, ?)',
      [creditAnalystId, page, pageSize],
    );

    // result[0] = total count result set
    // result[1] = data result set
    const totalCountResult = result[0] ?? [];
    const dataResult = result[1] ?? [];

    return {
      results: dataResult,
      data: dataResult,
      total: totalCountResult.length > 0 ? totalCountResult[0].total_count : 0,
    };
  }

  async callSP_CA_GetAllApprovalRequest_External(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(
      `CALL CA_GetAllApprovalRequest_External(?, ?);`,
      [page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_CA_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL CA_GetLoanApplicationById_External(?)`,
        [loanAppId],
      );

    return results;
  }
  async callSP_CA_GetDashboard_External(
    creditAnalystId: number,
  ): Promise<SupervisorStats> {
    const results: SupervisorStats = await this.ormRepository.manager.query(
      `CALL CA_GetDashboardStats(?)`,
      [creditAnalystId],
    );

    console.log(results[0][0]);
    return results[0][0];
  }

  //! ========== SVY ==========

  async callSP_SVY_GetAllUnscheduledSurveyList_External(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const manager = this.ormRepository.manager;
    const result = await manager.query(
      'CALL SVY_GetAllUnscheduledSurveyList_External(?, ?)',
      [page, pageSize],
    );

    return {
      data: result?.[0] ?? [],
      total: result?.[1]?.[0]?.total ?? 0,
    };
  }

  async callSP_SVY_GetAllScheduledSurveyList_External(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const manager = this.ormRepository.manager;
    const result = await manager.query(
      'CALL SVY_GetAllScheduledSurveyList_External(?, ?)',
      [page, pageSize],
    );

    return {
      data: result?.[0] ?? [],
      total: result?.[1]?.[0]?.total ?? 0,
    };
  }

  async callSP_SVY_GetClientDetailForSurveyPurpose_External(
    loan_app_id: number,
  ): Promise<ClientDetailForSurveyData> {
    try {
      const manager = this.ormRepository.manager;
      const result = await manager.query(
        'CALL SVY_GetClientDetailForSurveyPurpose(?)',
        [loan_app_id],
      );

      return result;
    } catch (error) {
      throw new Error(error.message || 'Failed to execute stored procedure');
    }
  }

  async callSP_SVY_GetSurveyHistoryByLoanAppId_External(
    loan_app_id: number,
  ): Promise<HistorySurveyExternalData> {
    try {
      console.log(loan_app_id);
      const manager = this.ormRepository.manager;
      const result = await manager.query(
        'CALL SVY_GetSurveyHistoryByLoanAppId_External(?)',
        [loan_app_id],
      );

      const reportData = result[0] || [];
      const photosData = result[1] || [];

      const report = reportData.length > 0 ? reportData[0] : null;

      // Remove id from report
      let reportWithoutId = null;
      if (report) {
        const { id, ...rest } = report;
        reportWithoutId = rest;
      }

      // Remove id and hasil_survey_id from photos
      const photosWithoutId = photosData.map(
        ({ id, hasil_survey_id, ...photo }) => photo,
      );

      return {
        survey_report: reportWithoutId,
        survey_photos: photosWithoutId,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to execute stored procedure');
    }
  }

  async callSP_SVY_GetAllSurveyHistory_External(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    try {
      const manager = this.ormRepository.manager;
      const result = await manager.query(
        'CALL SVY_GetAllSurveyHistory_External(?, ?)',
        [page, pageSize],
      );

      console.log('RAW RESULT:', result);

      // result[0] = [{total: X}]
      // result[1] = array of survey reports
      const total = result[0] && result[0].length > 0 ? result[0][0].total : 0;
      const data = result[1] || [];

      return {
        data,
        total,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to execute stored procedure');
    }
  }

  //! ========== HM ==========

  async callSP_HM_GetAllApprovalHistory_External(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const manager = this.ormRepository.manager;

    const result = await manager.query(
      `CALL HM_GetAllApprovalHistory_External(?, ?, ?)`,
      [hmId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_HM_GetAllApprovalRequest_External(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const manager = this.ormRepository.manager;
    const result = await manager.query(
      `CALL HM_GetAllApprovalRequest_External(?, ?, ?)`,
      [hmId, page, pageSize],
    );

    console.log('SP Result:', result);

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_HM_GetDetail_LoanApplicationsExternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL HM_GetLoanApplicationById_External(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_HM_GetAllTeams_External(hmId: number): Promise<any[]> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(`CALL HM_GetAllTeams_External(?)`, [
      hmId,
    ]);
    return result[0];
  }

  async callSP_HM_GetAllUsers(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const [totalResult, dataResult] = await this.dataSource.query(
      'CALL HM_GetAllUsers(?, ?)',
      [page, pageSize],
    );

    const total = totalResult?.[0]?.total_count || 0;
    const data = dataResult || [];

    return { data, total };
  }

  //! ========== AC ==========

  async callSP_AdCont_GetAllLoanData_External(
    p_page: number,
    p_page_size: number,
  ): Promise<any[]> {
    const manager = this.ormRepository.manager;

    const result = await manager.query(
      'CALL AdCont_GetAllLoanData_External(?, ?)',
      [p_page, p_page_size],
    );

    return result;
  }
}
