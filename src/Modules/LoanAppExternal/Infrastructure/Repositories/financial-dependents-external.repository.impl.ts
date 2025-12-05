import { Injectable, NotFoundException } from '@nestjs/common';
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
      { id: ormEntity.nasabah?.id }, // using object for nasabah like your example
      ormEntity.kondisi_tanggungan ?? undefined,
      ormEntity.validasi_tanggungan ?? undefined,
      ormEntity.id ?? undefined,
      ormEntity.created_at ?? undefined,
      ormEntity.updated_at ?? undefined,
      ormEntity.deleted_at ?? null,
    );
  }

  private toOrm(
    domainEntity: FinancialDependentsExternal,
  ): Partial<FinancialDependentsExternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: domainEntity.nasabah
        ? ({ id: domainEntity.nasabah.id } as ClientExternal_ORM_Entity)
        : undefined,
      kondisi_tanggungan: domainEntity.kondisi_tanggungan,
      validasi_tanggungan: domainEntity.validasi_tanggungan,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  private toOrmPartial(
    partial: Partial<FinancialDependentsExternal>,
  ): Partial<FinancialDependentsExternal_ORM_Entity> {
    const ormData: Partial<FinancialDependentsExternal_ORM_Entity> = {};

    if (partial.nasabah?.id !== undefined) {
      ormData.nasabah = { id: partial.nasabah.id } as ClientExternal_ORM_Entity;
    }
    if (partial.kondisi_tanggungan !== undefined)
      ormData.kondisi_tanggungan = partial.kondisi_tanggungan;
    if (partial.validasi_tanggungan !== undefined)
      ormData.validasi_tanggungan = partial.validasi_tanggungan;
    if (partial.created_at !== undefined)
      ormData.created_at = partial.created_at;
    if (partial.updated_at !== undefined)
      ormData.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined)
      ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  async findById(id: number): Promise<FinancialDependentsExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(
    nasabahId: number,
  ): Promise<FinancialDependentsExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<FinancialDependentsExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['nasabah'],
    });
    return ormEntities.map((e) => this.toDomain(e));
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
    if (!updated)
      throw new NotFoundException(
        `FinancialDependentsExternal with ID ${id} not found`,
      );
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
