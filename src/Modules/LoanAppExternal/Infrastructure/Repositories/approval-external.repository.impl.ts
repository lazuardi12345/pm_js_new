import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalExternal } from '../../Domain/Entities/approval-external.entity';
import { IApprovalExternalRepository } from '../../Domain/Repositories/approval-external.repository';
import { ApprovalExternal_ORM_Entity } from '../Entities/approval-external.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { ApprovalExternalNotificationRaw } from '../../Application/DTOS/dto-Approval/get-total-notification.dto';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Injectable()
export class ApprovalExternalRepositoryImpl
  implements IApprovalExternalRepository
{
  dataSource: any;
  db: any;
  constructor(
    @InjectRepository(ApprovalExternal_ORM_Entity)
    private readonly ormRepository: Repository<ApprovalExternal_ORM_Entity>,
  ) {}

  // MAPPER =======================================================================
  private toDomain(ormEntity: ApprovalExternal_ORM_Entity): ApprovalExternal {
    return new ApprovalExternal(
      { id: ormEntity.pengajuan_luar.id },
      ormEntity.user.id,
      ormEntity.role,
      ormEntity.is_banding,
      ormEntity.id,
      ormEntity.analisa,
      ormEntity.nominal_persetujuan,
      ormEntity.tenor_persetujuan,
      ormEntity.status,
      ormEntity.kesimpulan,
      ormEntity.dokumen_pendukung,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(
    domainEntity: ApprovalExternal,
  ): Partial<ApprovalExternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      pengajuan_luar: {
        id: domainEntity.pengajuan.id,
      } as LoanApplicationExternal_ORM_Entity,
      user: { id: domainEntity.user_id } as Users_ORM_Entity,
      role: domainEntity.role,
      analisa: domainEntity.analisa,
      nominal_persetujuan: domainEntity.nominal_persetujuan,
      tenor_persetujuan: domainEntity.tenor_persetujuan,
      status: domainEntity.status,
      kesimpulan: domainEntity.kesimpulan,
      dokumen_pendukung: domainEntity.dokumen_pendukung,
      is_banding: domainEntity.is_banding,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<ApprovalExternal>,
  ): Partial<ApprovalExternal_ORM_Entity> {
    const ormData: Partial<ApprovalExternal_ORM_Entity> = {};

    if (partial.pengajuan)
      ormData.pengajuan_luar = {
        id: partial.pengajuan.id,
      } as LoanApplicationExternal_ORM_Entity;
    if (partial.user_id)
      ormData.user = { id: partial.user_id } as Users_ORM_Entity;
    if (partial.role) ormData.role = partial.role;
    if (partial.analisa) ormData.analisa = partial.analisa;
    if (partial.nominal_persetujuan)
      ormData.nominal_persetujuan = partial.nominal_persetujuan;
    if (partial.tenor_persetujuan)
      ormData.tenor_persetujuan = partial.tenor_persetujuan;
    if (partial.status) ormData.status = partial.status;
    if (partial.kesimpulan) ormData.kesimpulan = partial.kesimpulan;
    if (partial.dokumen_pendukung)
      ormData.dokumen_pendukung = partial.dokumen_pendukung;
    if (partial.is_banding) ormData.is_banding = partial.is_banding;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  // ============================================================================

  async findById(id: number): Promise<ApprovalExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan_luar', 'user'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByPengajuanId(pengajuanId: number): Promise<ApprovalExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { pengajuan_luar: { id: pengajuanId } },
      relations: ['pengajuan_luar', 'user'],
    });
    return ormEntities.map(this.toDomain);
  }

  async findByNasabahId(nasabahId: number): Promise<ApprovalExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { user: { id: nasabahId } },
      relations: ['pengajuan_luar', 'user'],
    });
    return ormEntities.map(this.toDomain);
  }

  async save(approval: ApprovalExternal): Promise<ApprovalExternal> {
    const ormEntity = this.toOrm(approval);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    approvalData: Partial<ApprovalExternal>,
  ): Promise<ApprovalExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(approvalData));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['pengajuan_luar', 'user'],
    });
    if (!updated) throw new Error('ApprovalExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<ApprovalExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['pengajuan_luar', 'user'],
    });
    return ormEntities.map(this.toDomain);
  }

  // ======================
  // NOTIFICATION - REQUEST
  // ======================

  async totalApprovalRequestExternal(
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalExternalNotificationRaw> {
    return this.execCountSP(
      'GENERAL_NotificationApprovalsExternal',
      role,
      userId,
    );
  }

  private async execCountSP(
    spName: string,
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalExternalNotificationRaw> {
    const manager = this.ormRepository.manager;

    const result = await manager.query(`CALL ${spName}(?, ?)`, [role, userId]);

    return {
      total: result?.[0]?.[0]?.approval_request_total ?? 0,
    };
  }
}
