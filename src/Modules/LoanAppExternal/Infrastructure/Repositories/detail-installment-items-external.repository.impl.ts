import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DetailInstallmentItemsExternal } from '../../Domain/Entities/detail-installment-items-external.entity';
import { IDetailInstallmentItemsExternalRepository } from '../../Domain/Repositories/detail-installment-items-external.repository';
import { DetailInstallmentItemsExternal_ORM_Entity } from '../Entities/detail-installment-items.orm-entity';
import { OtherExistLoansExternal_ORM_Entity } from '../Entities/other-exist-loans.orm-entity';
@Injectable()
export class DetailInstallmentItemsExternalRepositoryImpl
  implements IDetailInstallmentItemsExternalRepository
{
  constructor(
    @InjectRepository(DetailInstallmentItemsExternal_ORM_Entity)
    private readonly ormRepo: Repository<DetailInstallmentItemsExternal_ORM_Entity>,
  ) {}

  // ===============================
  // MAPPING ORM -> DOMAIN
  // ===============================
  private buildDomain(
    entity: DetailInstallmentItemsExternal_ORM_Entity,
  ): DetailInstallmentItemsExternal {
    return new DetailInstallmentItemsExternal(
      { id: entity.otherExistLoan.id },
      entity.nama_pembiayaan,
      entity.total_pinjaman,
      entity.cicilan_perbulan,
      entity.sisa_tenor,
      entity.id,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
      entity.deleted_at ?? undefined,
    );
  }

  // ===============================
  // MAPPING DOMAIN -> ORM
  // ===============================
  private toOrm(
    domain: DetailInstallmentItemsExternal,
  ): Partial<DetailInstallmentItemsExternal_ORM_Entity> {
    return {
      id: domain.id,
      otherExistLoan: {
        id: domain.otherExistLoan.id,
      } as OtherExistLoansExternal_ORM_Entity,
      nama_pembiayaan: domain.nama_pembiayaan,
      cicilan_perbulan: domain.cicilan_perbulan,
      sisa_tenor: domain.sisa_tenor,
      total_pinjaman: domain.total_pinjaman,
    };
  }

  private toOrmPartial(
    data: Partial<DetailInstallmentItemsExternal>,
  ): Partial<DetailInstallmentItemsExternal_ORM_Entity> {
    const partial: Partial<DetailInstallmentItemsExternal_ORM_Entity> = {};

    if (data.otherExistLoan?.id)
      partial.otherExistLoan = {
        id: data.otherExistLoan.id,
      } as OtherExistLoansExternal_ORM_Entity;
    if (data.nama_pembiayaan !== undefined)
      partial.nama_pembiayaan = data.nama_pembiayaan;
    if (data.cicilan_perbulan !== undefined)
      partial.cicilan_perbulan = data.cicilan_perbulan;
    if (data.sisa_tenor !== undefined) partial.sisa_tenor = data.sisa_tenor;
    if (data.total_pinjaman !== undefined)
      partial.total_pinjaman = data.total_pinjaman;
    return partial;
  }

  // ===============================
  // CRUD IMPLEMENTATION
  // ===============================

  async save(
    domain: DetailInstallmentItemsExternal,
  ): Promise<DetailInstallmentItemsExternal> {
    const saved = await this.ormRepo.save(this.toOrm(domain));
    return this.buildDomain(saved);
  }

  async update(
    id: number,
    data: Partial<DetailInstallmentItemsExternal>,
  ): Promise<DetailInstallmentItemsExternal> {
    await this.ormRepo.update(id, this.toOrmPartial(data));

    const updated = await this.ormRepo.findOne({
      where: { id },
      relations: ['otherExistLoan'],
    });

    if (!updated) throw new Error('DetailInstallmentItemsExternal not found');

    return this.buildDomain(updated);
  }

  async findById(id: number): Promise<DetailInstallmentItemsExternal | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['otherExistLoan'],
    });
    return entity ? this.buildDomain(entity) : null;
  }

  async findByOtherExistId(
    otherExistLoanId: number,
  ): Promise<DetailInstallmentItemsExternal[]> {
    const entities = await this.ormRepo.find({
      where: { otherExistLoan: { id: otherExistLoanId } },
      relations: ['otherExistLoan'],
    });

    return entities.map((e) => this.buildDomain(e));
  }

  async findAll(): Promise<DetailInstallmentItemsExternal[]> {
    const entities = await this.ormRepo.find({
      relations: ['otherExistLoan'],
    });
    return entities.map((e) => this.buildDomain(e));
  }

  async delete(id: number): Promise<void> {
    const result = await this.ormRepo.softDelete(id);
    if (!result.affected) throw new Error('Record not found / already deleted');
  }
}
