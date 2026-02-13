import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalInternal } from '../../Domain/Entities/approval-internal.entity';
import { IApprovalInternalRepository } from '../../Domain/Repositories/approval-internal.repository';
import { ApprovalInternal_ORM_Entity } from '../Entities/approval-internal.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from '../Entities/loan-application-internal.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';

// Tambahan Import
import { LoanApplicationInternalRepositoryImpl } from './loanApp-internal.repository.impl';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { ApprovalInternalNotificationRaw } from '../../Application/DTOS/dto-Address/get-total-notification.dto';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Injectable()
export class ApprovalInternalRepositoryImpl
  implements IApprovalInternalRepository
{
  repo: any;
  constructor(
    @InjectRepository(ApprovalInternal_ORM_Entity)
    private readonly ormRepository: Repository<ApprovalInternal_ORM_Entity>,
    private readonly loanAppRepo: LoanApplicationInternalRepositoryImpl, // Inject repository Loan
  ) {}

  // ======================================================
  // =============== MAPPER FUNCTIONS =====================
  // ======================================================

  private toDomain(orm: ApprovalInternal_ORM_Entity): ApprovalInternal {
    return new ApprovalInternal(
      orm.pengajuan!.id,
      { id: orm.user!.id },
      orm.role!,
      orm.status,
      orm.tenor_persetujuan,
      orm.nominal_persetujuan,
      orm.is_banding,
      orm.id,
      orm.keterangan,
      orm.kesimpulan,
      orm.dokumen_pendukung,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  private toOrm(
    domainEntity: ApprovalInternal,
  ): Partial<ApprovalInternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      pengajuan: {
        id: domainEntity.pengajuan,
      } as LoanApplicationInternal_ORM_Entity,
      user: { id: domainEntity.user.id } as Users_ORM_Entity,
      role: domainEntity.role!,
      status: domainEntity.status!,
      tenor_persetujuan: domainEntity.tenorPersetujuan!,
      nominal_persetujuan: domainEntity.nominalPersetujuan!,
      is_banding: domainEntity.isBanding,
      keterangan: domainEntity.keterangan,
      kesimpulan: domainEntity.kesimpulan,
      dokumen_pendukung: domainEntity.dokumen_pendukung,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<ApprovalInternal>,
  ): Partial<ApprovalInternal_ORM_Entity> {
    const ormData: Partial<ApprovalInternal_ORM_Entity> = {};

    if (partial.pengajuan)
      ormData.pengajuan = {
        id: partial.pengajuan,
      } as LoanApplicationInternal_ORM_Entity;

    if (partial.user)
      ormData.user = { id: partial.user.id } as Users_ORM_Entity;

    if (partial.role) ormData.role = partial.role;
    if (partial.status) ormData.status = partial.status;
    if (partial.nominalPersetujuan)
      ormData.nominal_persetujuan = partial.nominalPersetujuan;
    if (partial.tenorPersetujuan)
      ormData.tenor_persetujuan = partial.tenorPersetujuan;
    if (partial.isBanding !== undefined) ormData.is_banding = partial.isBanding;
    if (partial.keterangan) ormData.keterangan = partial.keterangan;
    if (partial.kesimpulan) ormData.kesimpulan = partial.kesimpulan;
    if (partial.dokumen_pendukung)
      ormData.dokumen_pendukung = partial.dokumen_pendukung;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  // ======================================================
  // ============= STATUS MAPPING FUNCTION ================
  // ======================================================

  private mapApprovalToLoanStatus(
    role: string,
    approvalStatus: ApprovalInternalStatusEnum,
    isBanding?: boolean,
  ): StatusPengajuanEnum | null {
    if (isBanding) {
      // Jika status banding aktif
      if (role === 'CA') {
        return approvalStatus === ApprovalInternalStatusEnum.APPROVED
          ? StatusPengajuanEnum.APPROVED_BANDING_CA
          : StatusPengajuanEnum.REJECTED_BANDING_CA;
      }
      if (role === 'HM') {
        return approvalStatus === ApprovalInternalStatusEnum.APPROVED
          ? StatusPengajuanEnum.APPROVED_BANDING_HM
          : StatusPengajuanEnum.REJECTED_BANDING_HM;
      }
      return null;
    }

    switch (role) {
      case 'SPV':
        return approvalStatus === ApprovalInternalStatusEnum.APPROVED
          ? StatusPengajuanEnum.APPROVED_SPV
          : StatusPengajuanEnum.REJECTED_SPV;
      case 'CA':
        return approvalStatus === ApprovalInternalStatusEnum.APPROVED
          ? StatusPengajuanEnum.APPROVED_CA
          : StatusPengajuanEnum.REJECTED_CA;
      case 'HM':
        return approvalStatus === ApprovalInternalStatusEnum.APPROVED
          ? StatusPengajuanEnum.APPROVED_HM
          : StatusPengajuanEnum.REJECTED_HM;
      default:
        return null;
    }
  }

  // ======================================================
  // ================= CRUD REPOSITORY ====================
  // ======================================================

  async findById(id: number): Promise<ApprovalInternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['user', 'pengajuan'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<ApprovalInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { user: { id: nasabahId } },
      relations: ['user', 'pengajuan'],
    });
    return ormEntities.map(this.toDomain);
  }

  async findAll(): Promise<ApprovalInternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['user', 'pengajuan'],
    });
    return ormEntities.map(this.toDomain);
  }

  async save(approval: ApprovalInternal): Promise<ApprovalInternal> {
    const ormEntity = this.toOrm(approval);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    approvalData: Partial<ApprovalInternal>,
  ): Promise<ApprovalInternal> {
    await this.ormRepository.update(id, this.toOrmPartial(approvalData));

    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan', 'user'],
    });

    if (!updated) throw new Error('Approval not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findByLoanIdAndUserId(
    loanId: number,
    userId: number,
  ): Promise<ApprovalInternal | null> {
    return await this.repo.findOne({
      where: {
        pengajuan_id: loanId,
        user_id: userId,
      },
    });
  }

  async totalApprovalRequestInternal(
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalInternalNotificationRaw> {
    return this.execCountSP(
      'GENERAL_NotificationApprovalsInternal',
      role,
      userId,
    );
  }

  private async execCountSP(
    spName: string,
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalInternalNotificationRaw> {
    const manager = this.ormRepository.manager;

    const result = await manager.query(`CALL ${spName}(?, ?)`, [role, userId]);

    return {
      total: result?.[0]?.[0]?.approval_request_total ?? 0,
    };
  }
}
