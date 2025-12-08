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
    private readonly ormRepo: Repository<OtherExistLoansExternal_ORM_Entity>,
  ) {}

  // ===============================
  // MAPPING ORM -> DOMAIN
  // ===============================
  private buildDomain(entity: OtherExistLoansExternal_ORM_Entity): OtherExistLoansExternal {
    return new OtherExistLoansExternal(
      { id: entity.nasabah.id },
      entity.cicilan_lain as CicilanLainEnum,
      entity.nama_pembiayaan,
      entity.cicilan_perbulan,
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

  // ===============================
  // MAPPING DOMAIN -> ORM
  // ===============================
  private toOrm(domain: OtherExistLoansExternal): Partial<OtherExistLoansExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabah.id } as ClientExternal_ORM_Entity,
      cicilan_lain: domain.cicilan_lain,
      nama_pembiayaan: domain.nama_pembiayaan,
      cicilan_perbulan: domain.cicilan_perbulan,
      sisa_tenor: domain.sisa_tenor,
      total_pinjaman: domain.total_pinjaman,
      validasi_pinjaman_lain: domain.validasi_pinjaman_lain,
      catatan: domain.catatan,
    };
  }

  private toOrmPartial(data: Partial<OtherExistLoansExternal>): Partial<OtherExistLoansExternal_ORM_Entity> {
    const partial: Partial<OtherExistLoansExternal_ORM_Entity> = {};

    if (data.nasabah?.id) partial.nasabah = { id: data.nasabah.id } as ClientExternal_ORM_Entity;
    if (data.cicilan_lain !== undefined) partial.cicilan_lain = data.cicilan_lain;
    if (data.nama_pembiayaan !== undefined) partial.nama_pembiayaan = data.nama_pembiayaan;
    if (data.cicilan_perbulan !== undefined) partial.cicilan_perbulan = data.cicilan_perbulan;
    if (data.sisa_tenor !== undefined) partial.sisa_tenor = data.sisa_tenor;
    if (data.total_pinjaman !== undefined) partial.total_pinjaman = data.total_pinjaman;
    if (data.validasi_pinjaman_lain !== undefined) partial.validasi_pinjaman_lain = data.validasi_pinjaman_lain;
    if (data.catatan !== undefined) partial.catatan = data.catatan;

    return partial;
  }

  // ===============================
  // CRUD IMPLEMENTATION
  // ===============================

  async save(domain: OtherExistLoansExternal): Promise<OtherExistLoansExternal> {
    const saved = await this.ormRepo.save(this.toOrm(domain));
    return this.buildDomain(saved);
  }

  async update(id: number, data: Partial<OtherExistLoansExternal>): Promise<OtherExistLoansExternal> {
    await this.ormRepo.update(id, this.toOrmPartial(data));

    const updated = await this.ormRepo.findOne({
      where: { id },
      relations: ['nasabah'],
    });

    if (!updated) throw new Error('OtherExistLoansExternal not found');

    return this.buildDomain(updated);
  }

  async findById(id: number): Promise<OtherExistLoansExternal | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return entity ? this.buildDomain(entity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<OtherExistLoansExternal[]> {
    const entities = await this.ormRepo.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });

    return entities.map((e) => this.buildDomain(e));
  }

  async findAll(): Promise<OtherExistLoansExternal[]> {
    const entities = await this.ormRepo.find({
      relations: ['nasabah'],
    });
    return entities.map((e) => this.buildDomain(e));
  }

  async delete(id: number): Promise<void> {
    const result = await this.ormRepo.softDelete(id);
    if (!result.affected) throw new Error('Record not found / already deleted');
  }
}
