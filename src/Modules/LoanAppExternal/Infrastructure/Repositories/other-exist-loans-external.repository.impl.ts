import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OtherExistLoansExternal } from '../../Domain/Entities/other-exist-loans-external.entity';
import { IOtherExistLoansExternalRepository } from '../../Domain/Repositories/other-exist-loans-external.repository';

import { OtherExistLoansExternal_ORM_Entity } from '../Entities/other-exist-loans.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';
import { LoanApplicationExternal_ORM_Entity } from '../Entities/loan-application-external.orm-entity';

@Injectable()
export class OtherExistLoansExternalRepositoryImpl
  implements IOtherExistLoansExternalRepository
{
  constructor(
    @InjectRepository(OtherExistLoansExternal_ORM_Entity)
    private readonly ormRepo: Repository<OtherExistLoansExternal_ORM_Entity>,
  ) {}

  // ===============================
  // MAPPING ORM -> DOMAIN
  // ===============================
  private buildDomain(
    entity: OtherExistLoansExternal_ORM_Entity,
  ): OtherExistLoansExternal {
    return new OtherExistLoansExternal(
      { id: entity.loanAppExternal.id },
      entity.cicilan_lain as CicilanLainEnum,
      entity.id,
      entity.validasi_pinjaman_lain ?? undefined,
      entity.catatan ?? undefined,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
      entity.deleted_at ?? undefined,
    );
  }

  // ===============================
  // MAPPING DOMAIN -> ORM
  // ===============================
  private toOrm(
    domain: OtherExistLoansExternal,
  ): Partial<OtherExistLoansExternal_ORM_Entity> {
    return {
      id: domain.id,
      loanAppExternal: {
        id: domain.loanAppExternal.id,
      } as LoanApplicationExternal_ORM_Entity,
      cicilan_lain: domain.cicilan_lain,
      validasi_pinjaman_lain: domain.validasi_pinjaman_lain,
      catatan: domain.catatan,
    };
  }

  private toOrmPartial(
    data: Partial<OtherExistLoansExternal>,
  ): Partial<OtherExistLoansExternal_ORM_Entity> {
    const partial: Partial<OtherExistLoansExternal_ORM_Entity> = {};

    if (data.loanAppExternal?.id)
      partial.loanAppExternal = {
        id: data.loanAppExternal.id,
      } as LoanApplicationExternal_ORM_Entity;
    if (data.cicilan_lain !== undefined)
      partial.cicilan_lain = data.cicilan_lain;
    if (data.validasi_pinjaman_lain !== undefined)
      partial.validasi_pinjaman_lain = data.validasi_pinjaman_lain;
    if (data.catatan !== undefined) partial.catatan = data.catatan;

    return partial;
  }

  // ===============================
  // CRUD IMPLEMENTATION
  // ===============================

  async save(
    domain: OtherExistLoansExternal,
  ): Promise<OtherExistLoansExternal> {
    const saved = await this.ormRepo.save(this.toOrm(domain));
    return this.buildDomain(saved);
  }

  async update(
    id: number,
    data: Partial<OtherExistLoansExternal>,
  ): Promise<OtherExistLoansExternal> {
    await this.ormRepo.update(id, this.toOrmPartial(data));

    const updated = await this.ormRepo.findOne({
      where: { id },
      relations: ['loanAppExternal'],
    });

    if (!updated) throw new Error('OtherExistLoansExternal not found');

    return this.buildDomain(updated);
  }

  async findById(id: number): Promise<OtherExistLoansExternal | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['loanAppExternal'],
    });
    return entity ? this.buildDomain(entity) : null;
  }

  async findByLoanAppExternalId(
    loanAppExternalId: number,
  ): Promise<OtherExistLoansExternal[]> {
    const entities = await this.ormRepo.find({
      where: { loanAppExternal: { id: loanAppExternalId } },
      relations: ['loanAppExternal'],
    });

    return entities.map((e) => this.buildDomain(e));
  }

  async findAll(): Promise<OtherExistLoansExternal[]> {
    const entities = await this.ormRepo.find({
      relations: ['loanAppExternal'],
    });
    return entities.map((e) => this.buildDomain(e));
  }

  async delete(id: number): Promise<void> {
    const result = await this.ormRepo.softDelete(id);
    if (!result.affected) throw new Error('Record not found / already deleted');
  }
}
