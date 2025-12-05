import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OtherExistLoansExternal } from '../../Domain/Entities/other-exist-loans-external.entity';
import { IOtherExistLoansExternalRepository } from '../../Domain/Repositories/other-exist-loans-external.repository';

import { OtherExistLoansExternal_ORM_Entity } from '../Entities/other-exist-loans.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

@Injectable()
export class OtherExistLoansExternalRepositoryImpl
  implements IOtherExistLoansExternalRepository
{
  constructor(
    @InjectRepository(OtherExistLoansExternal_ORM_Entity)
    private readonly orm_repository: Repository<OtherExistLoansExternal_ORM_Entity>,
  ) {}
  private to_domain(
    entity: OtherExistLoansExternal_ORM_Entity,
  ): OtherExistLoansExternal {
    return new OtherExistLoansExternal(
      { id: entity.nasabah.id },
      entity.cicilan_lain as CicilanLainEnum,
      entity.nama_pembiayaan,
      Number(entity.cicilan_perbulan),
      entity.sisa_tenor,
      entity.id,
      entity.total_pinjaman ?? undefined,
      entity.validasi_pinjaman_lain ?? undefined,
      entity.catatan ?? undefined,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
      entity.deleted_at ?? undefined,
    );
  }

  private to_orm(
    domain: OtherExistLoansExternal,
  ): Partial<OtherExistLoansExternal_ORM_Entity> {
    return {
      id: domain.id ?? undefined,
      nasabah: { id: domain.nasabah.id } as ClientExternal_ORM_Entity,
      cicilan_lain: domain.cicilan_lain,
      nama_pembiayaan: domain.nama_pembiayaan,
      cicilan_perbulan: domain.cicilan_perbulan,
      sisa_tenor: domain.sisa_tenor,
      total_pinjaman: domain.total_pinjaman,
      validasi_pinjaman_lain: domain.validasi_pinjaman_lain,
      catatan: domain.catatan,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  private to_orm_partial(
    partial: Partial<OtherExistLoansExternal>,
  ): Partial<OtherExistLoansExternal_ORM_Entity> {
    const orm_data: Partial<OtherExistLoansExternal_ORM_Entity> = {};

    if (partial.nasabah?.id) {
      orm_data.nasabah = {
        id: partial.nasabah.id,
      } as ClientExternal_ORM_Entity;
    }

    if (partial.cicilan_lain) {
      orm_data.cicilan_lain = partial.cicilan_lain as CicilanLainEnum;
    }

    if (partial.nama_pembiayaan) {
      orm_data.nama_pembiayaan = partial.nama_pembiayaan;
    }

    if (partial.cicilan_perbulan !== undefined) {
      orm_data.cicilan_perbulan = partial.cicilan_perbulan;
    }

    if (partial.sisa_tenor !== undefined) {
      orm_data.sisa_tenor = partial.sisa_tenor;
    }

    if (partial.total_pinjaman !== undefined) {
      orm_data.total_pinjaman = partial.total_pinjaman;
    }

    if (partial.validasi_pinjaman_lain !== undefined) {
      orm_data.validasi_pinjaman_lain = partial.validasi_pinjaman_lain;
    }

    if (partial.catatan) {
      orm_data.catatan = partial.catatan;
    }

    if (partial.created_at) {
      orm_data.created_at = partial.created_at;
    }

    if (partial.updated_at) {
      orm_data.updated_at = partial.updated_at;
    }

    if (partial.deleted_at) {
      orm_data.deleted_at = partial.deleted_at;
    }

    return orm_data;
  }

  async findById(id: number): Promise<OtherExistLoansExternal | null> {
    const entity = await this.orm_repository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return entity ? this.to_domain(entity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<OtherExistLoansExternal[]> {
    const entities = await this.orm_repository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return entities.map((e) => this.to_domain(e));
  }

  async findAll(): Promise<OtherExistLoansExternal[]> {
    const entities = await this.orm_repository.find({
      relations: ['nasabah'],
    });
    return entities.map((e) => this.to_domain(e));
  }

  async save(
    domain: OtherExistLoansExternal,
  ): Promise<OtherExistLoansExternal> {
    const orm_entity = this.to_orm(domain);
    const saved = await this.orm_repository.save(orm_entity);

    return this.to_domain(saved as OtherExistLoansExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<OtherExistLoansExternal>,
  ): Promise<OtherExistLoansExternal> {
    await this.orm_repository.update(id, this.to_orm_partial(data));

    const updated = await this.orm_repository.findOne({
      where: { id },
      relations: ['nasabah'],
    });

    if (!updated) {
      throw new Error('OtherExistLoansExternal not found');
    }

    return this.to_domain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.orm_repository.softDelete(id);
  }
}
