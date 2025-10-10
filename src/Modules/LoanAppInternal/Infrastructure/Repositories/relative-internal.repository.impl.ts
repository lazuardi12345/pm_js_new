import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelativesInternal } from '../../Domain/Entities/relative-internal.entity';
import { IRelativesInternalRepository } from '../../Domain/Repositories/relatives-internal.repository';
import { RelativeInternal_ORM_Entity } from '../Entities/relative-internal.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
@Injectable()
export class RelativeInternalRepositoryImpl
  implements IRelativesInternalRepository
{
  constructor(
    @InjectRepository(RelativeInternal_ORM_Entity)
    private readonly ormRepository: Repository<RelativeInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(orm: RelativeInternal_ORM_Entity): RelativesInternal {
    return new RelativesInternal(
      orm.nasabah,
      orm.kerabat_kerja,
      orm.id,
      orm.nama,
      orm.alamat,
      orm.no_hp,
      orm.status_hubungan,
      orm.nama_perusahaan,
      orm.created_at,
      orm.updated_at,
      orm.deleted_at,
    );
  }

  //? All Transactions that using for Create datas

  private toOrm(
    domainEntity: RelativesInternal,
  ): Partial<RelativeInternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabah.id } as ClientInternal_ORM_Entity,
      kerabat_kerja: domainEntity.kerabat_kerja,
      nama: domainEntity.nama,
      alamat: domainEntity.alamat,
      no_hp: domainEntity.no_hp,
      status_hubungan: domainEntity.status_hubungan,
      nama_perusahaan: domainEntity.nama_perusahaan,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete

  private toOrmPartial(
    partial: Partial<RelativesInternal>,
  ): Partial<RelativeInternal_ORM_Entity> {
    const ormData: Partial<RelativeInternal_ORM_Entity> = {};

    if (partial.nasabah)
      ormData.nasabah! = {
        id: partial.nasabah.id,
      } as ClientInternal_ORM_Entity;
    if (partial.kerabat_kerja) ormData.kerabat_kerja = partial.kerabat_kerja;
    if (partial.id) ormData.id = partial.id;
    if (partial.nama) ormData.nama = partial.nama;
    if (partial.alamat) ormData.alamat = partial.alamat;
    if (partial.no_hp) ormData.no_hp = partial.no_hp;
    if (partial.status_hubungan)
      ormData.status_hubungan = partial.status_hubungan;
    if (partial.nama_perusahaan)
      ormData.nama_perusahaan = partial.nama_perusahaan;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<RelativesInternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<RelativesInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async save(relatives: RelativesInternal): Promise<RelativesInternal> {
    const ormEntity = this.toOrm(relatives);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    relativeData: Partial<RelativesInternal>,
  ): Promise<RelativesInternal> {
    await this.ormRepository.update(id, this.toOrmPartial(relativeData));
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Job not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<RelativesInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
