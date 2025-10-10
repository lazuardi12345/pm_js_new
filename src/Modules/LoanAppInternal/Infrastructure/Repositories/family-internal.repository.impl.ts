import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyInternal } from '../../Domain/Entities/family-internal.entity';
import { IFamilyInternalRepository } from '../../Domain/Repositories/family-internal.repository';
import { FamilyInternal_ORM_Entity } from '../Entities/family-internal.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
@Injectable()
export class FamilyInternalRepositoryImpl implements IFamilyInternalRepository {
  constructor(
    @InjectRepository(FamilyInternal_ORM_Entity)
    private readonly ormRepository: Repository<FamilyInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(orm: FamilyInternal_ORM_Entity): FamilyInternal {
    return new FamilyInternal(
      orm.nasabah,
      orm.hubungan,
      orm.nama,
      orm.bekerja,
      orm.id,
      orm.created_at,
      orm.deleted_at,
      orm.nama_perusahaan,
      orm.jabatan,
      orm.penghasilan,
      orm.alamat_kerja,
      orm.no_hp,
      orm.updated_at,
    );
  }

  //? All Transactions that using for Create datas

  private toOrm(
    domainEntity: FamilyInternal,
  ): Partial<FamilyInternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabah.id } as ClientInternal_ORM_Entity,
      hubungan: domainEntity.hubungan,
      nama: domainEntity.nama,
      bekerja: domainEntity.bekerja,
      nama_perusahaan: domainEntity.nama_perusahaan,
      jabatan: domainEntity.jabatan,
      penghasilan: domainEntity.penghasilan,
      alamat_kerja: domainEntity.alamat_kerja,
      no_hp: domainEntity.no_hp,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete

  private toOrmPartial(
    partial: Partial<FamilyInternal>,
  ): Partial<FamilyInternal_ORM_Entity> {
    const ormData: Partial<FamilyInternal_ORM_Entity> = {};

    if (partial.nasabah)
      ormData.nasabah! = {
        id: partial.nasabah.id,
      } as ClientInternal_ORM_Entity;
    if (partial.hubungan) ormData.hubungan = partial.hubungan;
    if (partial.nama) ormData.nama = partial.nama;
    if (partial.bekerja) ormData.bekerja = partial.bekerja;
    if (partial.nama_perusahaan)
      ormData.nama_perusahaan = partial.nama_perusahaan;
    if (partial.jabatan) ormData.jabatan = partial.jabatan;
    if (partial.penghasilan) ormData.penghasilan = partial.penghasilan;
    if (partial.alamat_kerja) ormData.alamat_kerja = partial.alamat_kerja;
    if (partial.no_hp) ormData.no_hp = partial.no_hp;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<FamilyInternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<FamilyInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async save(address: FamilyInternal): Promise<FamilyInternal> {
    const ormEntity = this.toOrm(address);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    familyData: Partial<FamilyInternal>,
  ): Promise<FamilyInternal> {
    await this.ormRepository.update(id, this.toOrmPartial(familyData));

    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Family not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<FamilyInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
