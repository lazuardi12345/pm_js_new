import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalInternal } from '../../Domain/Entities/approval-internal.entity';
import { IApprovalInternalRepository } from '../../Domain/Repositories/approval-internal.repository';
import { ApprovalInternal_ORM_Entity } from '../Entities/approval-internal.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from '../Entities/loan-application-internal.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';

@Injectable()
export class ApprovalInternalRepositoryImpl
  implements IApprovalInternalRepository
{
  constructor(
    @InjectRepository(ApprovalInternal_ORM_Entity)
    private readonly ormRepository: Repository<ApprovalInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

private toDomain(orm: ApprovalInternal_ORM_Entity): ApprovalInternal {
  return new ApprovalInternal(
    orm.pengajuan!.id,
    { id: orm.user!.id },
    orm.role!,
    orm.status,
    orm.is_banding,
    orm.id,
    orm.keterangan,
    orm.kesimpulan,
    orm.created_at,
    orm.updated_at,
    orm.deleted_at,
  );
}

  //? All Transactions that using for Create datas

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
      is_banding: domainEntity.isBanding,
      keterangan: domainEntity.keterangan,
      kesimpulan: domainEntity.kesimpulan,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete

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
  if (partial.isBanding !== undefined) ormData.is_banding = partial.isBanding;
  if (partial.keterangan) ormData.keterangan = partial.keterangan;
  if (partial.kesimpulan) ormData.kesimpulan = partial.kesimpulan;
  if (partial.createdAt) ormData.created_at = partial.createdAt;
  if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
  if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

  return ormData;
}

  //?===================================================================================

  async findById(id: number): Promise<ApprovalInternal | null> {
  const ormEntity = await this.ormRepository.findOne({
    where: { id },
    relations: ['user', 'pengajuan'], // <- wajib
  });
  return ormEntity ? this.toDomain(ormEntity) : null;
}

  async findByNasabahId(nasabahId: number): Promise<ApprovalInternal[]> {
  const ormEntities = await this.ormRepository.find({
    where: { user: { id: nasabahId } },
    relations: ['user', 'pengajuan'], // <- wajib
  });
  return ormEntities.map(this.toDomain);
}

  async save(address: ApprovalInternal): Promise<ApprovalInternal> {
    const ormEntity = this.toOrm(address);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

async update(
  id: number,
  addressData: Partial<ApprovalInternal>,
): Promise<ApprovalInternal> {
  await this.ormRepository.update(id, this.toOrmPartial(addressData));

  const updated = await this.ormRepository.findOne({
    where: { id },
    relations: ['pengajuan', 'user'], // penting!
  });

  if (!updated) throw new Error('Approval not found');

  return this.toDomain(updated);
}


  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

 async findAll(): Promise<ApprovalInternal[]> {
  const ormEntities = await this.ormRepository.find({
    relations: ['user', 'pengajuan'], // <- wajib
  });
  return ormEntities.map(this.toDomain);
}
}
