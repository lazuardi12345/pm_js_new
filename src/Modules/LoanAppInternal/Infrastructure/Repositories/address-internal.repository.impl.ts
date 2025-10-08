// infrastructure/repositories/address-internal.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressInternal } from '../../Domain/Entities/address-internal.entity';
import { IAddressInternalRepository } from '../../Domain/Repositories/address-internal.repository';
import { AddressInternal_ORM_Entity } from '../Entities/address-internal.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';

@Injectable()
export class AddressInternalRepositoryImpl
  implements IAddressInternalRepository
{
  constructor(
    @InjectRepository(AddressInternal_ORM_Entity)
    private readonly ormRepository: Repository<AddressInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas
  private toDomain(ormEntity: AddressInternal_ORM_Entity): AddressInternal {
    return new AddressInternal(
      ormEntity.nasabah,
      ormEntity.alamat_ktp,
      ormEntity.rt_rw,
      ormEntity.kelurahan,
      ormEntity.kecamatan,
      ormEntity.kota,
      ormEntity.provinsi,
      ormEntity.status_rumah,
      ormEntity.domisili,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.deleted_at,
      ormEntity.status_rumah_ktp,
      ormEntity.alamat_lengkap,
      ormEntity.updated_at,
    );
  }

  //? All Transactions that using for Create datas
  private toOrm(
    domainEntity: AddressInternal,
  ): Partial<AddressInternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabah.id } as ClientInternal_ORM_Entity,
      alamat_ktp: domainEntity.alamat_ktp,
      rt_rw: domainEntity.rt_rw,
      kelurahan: domainEntity.kelurahan,
      kecamatan: domainEntity.kecamatan,
      kota: domainEntity.kota,
      provinsi: domainEntity.provinsi,
      status_rumah: domainEntity.status_rumah,
      domisili: domainEntity.domisili,
      status_rumah_ktp: domainEntity.status_rumah_ktp,
      alamat_lengkap: domainEntity.alamat_lengkap,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete
  private toOrmPartial(
    partial: Partial<AddressInternal>,
  ): Partial<AddressInternal_ORM_Entity> {
    const ormData: Partial<AddressInternal_ORM_Entity> = {};

    if (partial.nasabah)
      ormData.nasabah = {
        id: partial.nasabah.id,
      } as ClientInternal_ORM_Entity;
    if (partial.alamat_ktp) ormData.alamat_ktp = partial.alamat_ktp;
    if (partial.rt_rw) ormData.rt_rw = partial.rt_rw;
    if (partial.kelurahan) ormData.kelurahan = partial.kelurahan;
    if (partial.kecamatan) ormData.kecamatan = partial.kecamatan;
    if (partial.kota) ormData.kota = partial.kota;
    if (partial.provinsi) ormData.provinsi = partial.provinsi;
    if (partial.status_rumah) ormData.status_rumah = partial.status_rumah;
    if (partial.domisili) ormData.domisili = partial.domisili;
    if (partial.status_rumah_ktp)
      ormData.status_rumah_ktp = partial.status_rumah_ktp;
    if (partial.alamat_lengkap) ormData.alamat_lengkap = partial.alamat_lengkap;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }
  //?===================================================================================

  async findById(id: number): Promise<AddressInternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<AddressInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async save(address: AddressInternal): Promise<AddressInternal> {
    const ormEntity = this.toOrm(address);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    addressData: Partial<AddressInternal>,
  ): Promise<AddressInternal> {

    await this.ormRepository.update(id, this.toOrmPartial(addressData));
    console.log("id>>>>>>>>>>>>>>", id)
    const updated = await this.ormRepository.findOne({
      where: { id },
    });
    if (!updated) throw new Error('Address not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<AddressInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
