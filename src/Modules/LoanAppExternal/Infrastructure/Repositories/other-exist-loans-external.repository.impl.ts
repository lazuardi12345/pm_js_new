// Infrastructure/Repositories/other-exist-loans-external.repository.impl.ts
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
    private readonly ormRepository: Repository<OtherExistLoansExternal_ORM_Entity>,
  ) {}

  private toDomain(entity: OtherExistLoansExternal_ORM_Entity): OtherExistLoansExternal {
    return new OtherExistLoansExternal(
      entity.id,
      entity.cicilan_lain,
      entity.nama_pembiayaan,
      Number(entity.cicilan_perbulan),
      entity.sisa_tenor,
      entity.nasabah.id,
      entity.total_pinjaman ?? undefined,
      entity.validasi_pinjaman_lain ?? undefined,
      entity.catatan ?? undefined,
      entity.created_at ?? undefined,
      entity.updated_at ?? undefined,
      entity.deleted_at ?? undefined,
    );
  }

  private toOrm(domain: OtherExistLoansExternal): Partial<OtherExistLoansExternal_ORM_Entity> {
    return {
      id: domain.id ?? undefined,
      nasabah: { id: domain.nasabahId } as ClientExternal_ORM_Entity,
      cicilan_lain: domain.cicilanLain,
      nama_pembiayaan: domain.namaPembiayaan,
      cicilan_perbulan: domain.cicilanPerbulan,
      sisa_tenor: domain.sisaTenor,
      total_pinjaman: domain.totalPinjaman,
      validasi_pinjaman_lain: domain.validasiPinjamanLain,
      catatan: domain.catatan,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<OtherExistLoansExternal>,
  ): Partial<OtherExistLoansExternal_ORM_Entity> {
    const ormData: Partial<OtherExistLoansExternal_ORM_Entity> = {};

    if (partial.nasabahId)
      ormData.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.cicilanLain)
      ormData.cicilan_lain = partial.cicilanLain as CicilanLainEnum;
    if (partial.namaPembiayaan) ormData.nama_pembiayaan = partial.namaPembiayaan;
    if (partial.cicilanPerbulan !== undefined)
      ormData.cicilan_perbulan = partial.cicilanPerbulan;
    if (partial.sisaTenor !== undefined)
      ormData.sisa_tenor = partial.sisaTenor;
    if (partial.totalPinjaman !== undefined)
      ormData.total_pinjaman = partial.totalPinjaman;
    if (partial.validasiPinjamanLain !== undefined)
      ormData.validasi_pinjaman_lain = partial.validasiPinjamanLain;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<OtherExistLoansExternal | null> {
    const entity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<OtherExistLoansExternal[]> {
    const entities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<OtherExistLoansExternal[]> {
    const entities = await this.ormRepository.find({ relations: ['nasabah'] });
    return entities.map((e) => this.toDomain(e));
  }

  async save(domain: OtherExistLoansExternal): Promise<OtherExistLoansExternal> {
    const ormEntity = this.toOrm(domain);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved as OtherExistLoansExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<OtherExistLoansExternal>,
  ): Promise<OtherExistLoansExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('OtherExistLoansExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
