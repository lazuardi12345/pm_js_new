import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialDependentsExternal } from '../../Domain/Entities/financial-dependents-external.entity';
import { IFinancialDependentsExternalRepository } from '../../Domain/Repositories/financial-dependents-external.repository';
import { FinancialDependentsExternal_ORM_Entity } from '../Entities/financial-dependents.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class FinancialDependentsExternalRepositoryImpl
  implements IFinancialDependentsExternalRepository
{
  constructor(
    @InjectRepository(FinancialDependentsExternal_ORM_Entity)
    private readonly ormRepository: Repository<FinancialDependentsExternal_ORM_Entity>,
  ) {}

  private toDomain(
    ormEntity: FinancialDependentsExternal_ORM_Entity,
  ): FinancialDependentsExternal {
    return new FinancialDependentsExternal(
      ormEntity.nasabah.id,
      ormEntity.kondisi_tanggungan,
      ormEntity.validasi_tanggungan,
      ormEntity.catatan,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(
    domainEntity: FinancialDependentsExternal,
  ): Partial<FinancialDependentsExternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabahId } as ClientExternal_ORM_Entity,
      kondisi_tanggungan: domainEntity.kondisiTanggungan,
      validasi_tanggungan: domainEntity.validasiTanggungan,
      catatan: domainEntity.catatan,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<FinancialDependentsExternal>,
  ): Partial<FinancialDependentsExternal_ORM_Entity> {
    const ormData: Partial<FinancialDependentsExternal_ORM_Entity> = {};

    if (partial.nasabahId)
      ormData.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.kondisiTanggungan !== undefined)
      ormData.kondisi_tanggungan = partial.kondisiTanggungan;
    if (partial.validasiTanggungan !== undefined)
      ormData.validasi_tanggungan = partial.validasiTanggungan;
    if (partial.catatan !== undefined) ormData.catatan = partial.catatan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<FinancialDependentsExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<FinancialDependentsExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((entity) => this.toDomain(entity));
  }


  async findAll(): Promise<FinancialDependentsExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['nasabah'],
    });
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async save(
    dependent: FinancialDependentsExternal,
  ): Promise<FinancialDependentsExternal> {
    const ormEntity = this.toOrm(dependent);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm as FinancialDependentsExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<FinancialDependentsExternal>,
  ): Promise<FinancialDependentsExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('FinancialDependentsExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
