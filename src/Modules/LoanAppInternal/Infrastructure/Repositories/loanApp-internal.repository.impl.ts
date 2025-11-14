import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplicationInternal } from '../../Domain/Entities/loan-application-internal.entity';
import {
  MarketingStats,
  ILoanApplicationInternalRepository,
  SupervisorStats,
} from '../../Domain/Repositories/loanApp-internal.repository';
import { LoanApplicationInternal_ORM_Entity } from '../Entities/loan-application-internal.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
import {
  TypeApprovalDetail,
  TypeLoanApplicationDetail,
} from 'src/Modules/Users/Roles/Marketing-Internal/Applications/DTOS/MKT_CreateLoanApplication.dto';
import {
  StatusPengajuanAkhirEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';
import { paginationInterface } from 'src/Shared/Interface/Pagination.interface';
import { General_ClientDataInterface } from 'src/Shared/Interface/General_ClientsDatabase/ClientData.interface';
import { General_LoanApplicationDataInterface } from 'src/Shared/Interface/General_ClientsDatabase/ClientHistoryLoanApplication.interface';
import { LoanApplicationSummary } from 'src/Shared/Interface/General_ClientsDatabase/BankDataLoanApplication.interface';
@Injectable()
export class LoanApplicationInternalRepositoryImpl
  implements ILoanApplicationInternalRepository
{
  dataSource: any;
  db: any;
  constructor(
    @InjectRepository(LoanApplicationInternal_ORM_Entity)
    private readonly ormRepository: Repository<LoanApplicationInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(
    orm: LoanApplicationInternal_ORM_Entity,
  ): LoanApplicationInternal {
    console.log('orm > : ', orm);
    return new LoanApplicationInternal(
      orm.nasabah,
      orm.status_pinjaman,
      orm.nominal_pinjaman,
      orm.tenor,
      orm.keperluan,
      orm.id,
      orm.created_at,
      orm.deleted_at,
      orm.status,
      orm.status_akhir_pengajuan,
      orm.pinjaman_ke,
      orm.riwayat_nominal,
      orm.riwayat_tenor,
      orm.sisa_pinjaman,
      orm.notes,
      orm.is_banding,
      orm.alasan_banding,
      orm.updated_at,
    );
  }

  //? All Transactions that using for Create datas

  private toOrm(
    domainEntity: LoanApplicationInternal,
  ): Partial<LoanApplicationInternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabah.id } as ClientInternal_ORM_Entity,
      status_pinjaman: domainEntity.status_pinjaman,
      nominal_pinjaman: domainEntity.nominal_pinjaman,
      tenor: domainEntity.tenor,
      keperluan: domainEntity.keperluan,
      status: domainEntity.status,
      pinjaman_ke: domainEntity.pinjaman_ke,
      riwayat_nominal: domainEntity.riwayat_nominal,
      riwayat_tenor: domainEntity.riwayat_tenor,
      sisa_pinjaman: domainEntity.sisa_pinjaman,
      notes: domainEntity.notes,
      is_banding: domainEntity.is_banding,
      alasan_banding: domainEntity.alasan_banding,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete

  private toOrmPartial(
    partial: Partial<LoanApplicationInternal>,
  ): Partial<LoanApplicationInternal_ORM_Entity> {
    const ormData: Partial<LoanApplicationInternal_ORM_Entity> = {};

    if (partial.nasabah)
      ormData.nasabah! = {
        id: partial.nasabah.id,
      } as ClientInternal_ORM_Entity;
    if (partial.status_pinjaman)
      ormData.status_pinjaman = partial.status_pinjaman;
    if (partial.nominal_pinjaman)
      ormData.nominal_pinjaman = partial.nominal_pinjaman;
    if (partial.tenor) ormData.tenor = partial.tenor;
    if (partial.keperluan) ormData.keperluan = partial.keperluan;
    if (partial.status) ormData.status = partial.status;
    if (partial.pinjaman_ke) ormData.pinjaman_ke = partial.pinjaman_ke;
    if (partial.riwayat_nominal)
      ormData.riwayat_nominal = partial.riwayat_nominal;
    if (partial.riwayat_tenor) ormData.riwayat_tenor = partial.riwayat_tenor;
    if (partial.sisa_pinjaman) ormData.sisa_pinjaman = partial.sisa_pinjaman;
    if (partial.notes) ormData.notes = partial.notes;
    if (partial.is_banding) ormData.is_banding = partial.is_banding;
    if (partial.alasan_banding) ormData.alasan_banding = partial.alasan_banding;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<LoanApplicationInternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<LoanApplicationInternal[]> {
    console.log('REMEMBER SUMMER DAAYYYSSSS >>>>>>>>>>>>>>>> > : ', nasabahId);
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
    });
    console.log(
      'REMEMBER SUMMER DAAYYYSSSS >>>>>>>>>>>>>>>> > : ',
      ormEntities,
    );
    return ormEntities.map(this.toDomain);
  }

  async save(
    loanApp: LoanApplicationInternal,
  ): Promise<LoanApplicationInternal> {
    const ormEntity = this.toOrm(loanApp);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    loanAppData: Partial<LoanApplicationInternal>,
  ): Promise<LoanApplicationInternal> {
    await this.ormRepository.update(id, this.toOrmPartial(loanAppData));
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Loan Application not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateLoanAppInternalStatus(
    loan_id: number,
    status: StatusPengajuanEnum,
  ): Promise<void> {
    await this.ormRepository.update({ id: loan_id }, { status: status });
  }

  async triggerBanding(loan_id: number, alasan_banding: string): Promise<void> {
    const now = new Date();
    await this.ormRepository.update(
      { id: loan_id },
      {
        status: StatusPengajuanEnum.BANDING,
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
        status_akhir_pengajuan: status,
        updated_at: now,
      },
    );
  }

  async findAll(): Promise<LoanApplicationInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }

  async callSP_GENERAL_GetAllPreviewDataLoanBySearch_Internal(
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
      'CALL GENERAL_GetAllPreviewDataLoanBySearch_Internal(?, ?, ?, ?, ?)',
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

  async callSP_GENERAL_GetClientDatabaseInternal(
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

  async callSP_MKT_GetAllLoanApplications_Internal(
    marketingId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;

    const result = await ormEntities.query(
      `CALL MKT_GetAllLoanApplications_Internal(?, ?, ?);`,
      [marketingId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_MKT_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL MKT_GetLoanApplicationById_Internal(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_MKT_GetAllRepeatOrderHistory_Internal(
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
        `CALL MKT_GetAllRepeatOrderHistory_Internal(?, ?, ?)`,
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

  async callSP_MKT_GetDashboard_Internal(
    marketingId: number,
  ): Promise<MarketingStats> {
    const results: MarketingStats = await this.ormRepository.manager.query(
      `CALL MKT_GetDashboardStats(?)`,
      [marketingId],
    );

    console.log(results[0][0]);
    return results[0][0];
  }

  async callSP_SPV_GetAllApprovalHistory_ByTeam(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(
      `CALL SPV_GetApprovalHistoryByTeams_Internal(?, ?, ?);`,
      [supervisorId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_SPV_GetAllApprovalRequest_Internal(
    supervisorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(
      `CALL SPV_GetAllApprovalRequest_Internal(?, ?, ?);`,
      [supervisorId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_SPV_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL SPV_GetLoanApplicationById_Internal(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_SPV_GetAllTeams_Internal(supervisorId: number): Promise<any[]> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(`CALL SPV_GetAllTeams_Internal(?)`, [
      supervisorId,
    ]);
    return result[0];
  }

  async callSP_SPV_GetDashboard_Internal(
    supervisorId: number,
  ): Promise<SupervisorStats> {
    const results: SupervisorStats = await this.ormRepository.manager.query(
      `CALL SPV_GetDashboardStats(?)`,
      [supervisorId],
    );

    console.log(results[0][0]);
    return results[0][0];
  }

  async callSP_CA_GetApprovalHistory_Internal(
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
      'CALL CA_GetApprovalHistory_Internal(?, ?, ?)',
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

  async callSP_CA_GetAllApprovalRequest_Internal(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(
      `CALL CA_GetAllApprovalRequest_Internal(?, ?);`,
      [page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_CA_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL CA_GetLoanApplicationById_Internal(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_CA_GetDashboard_Internal(
    creditAnalystId: number,
  ): Promise<SupervisorStats> {
    const results: SupervisorStats = await this.ormRepository.manager.query(
      `CALL CA_GetDashboardStats(?)`,
      [creditAnalystId],
    );

    console.log(results[0][0]);
    return results[0][0];
  }

  // ========== HEAD MARKETING (HM) ==========

  async callSP_HM_GetAllApprovalHistory_Internal(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const manager = this.ormRepository.manager;

    const result = await manager.query(
      `CALL HM_GetAllApprovalHistory_Internal(?, ?, ?)`,
      [hmId, page, pageSize],
    );

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_HM_GetAllApprovalRequest_Internal(
    hmId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const manager = this.ormRepository.manager;
    const result = await manager.query(
      `CALL HM_GetAllApprovalRequest_Internal(?, ?, ?)`,
      [hmId, page, pageSize],
    );

    console.log('SP Result:', result);

    return {
      data: result[1] || [],
      total: result[0]?.[0]?.total_count || 0,
    };
  }

  async callSP_HM_GetDetail_LoanApplicationsInternal_ById(
    loanAppId: number,
  ): Promise<[TypeLoanApplicationDetail[], TypeApprovalDetail[]]> {
    const results: [TypeLoanApplicationDetail[], TypeApprovalDetail[]] =
      await this.ormRepository.manager.query(
        `CALL HM_GetLoanApplicationById_Internal(?)`,
        [loanAppId],
      );

    return results;
  }

  async callSP_HM_GetAllTeams_Internal(hmId: number): Promise<any[]> {
    const ormEntities = this.ormRepository.manager;
    const result = await ormEntities.query(`CALL HM_GetAllTeams_Internal(?)`, [
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
}
