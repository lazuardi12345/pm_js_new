import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddressExternal } from '../../Domain/Entities/address-external.entity';
import { IAddressExternalRepository } from '../../Domain/Repositories/address-external.repository';
import { AddressExternal_ORM_Entity } from '../Entities/address-external.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class AddressExternalRepositoryImpl
  implements IAddressExternalRepository
{
  constructor(
    @InjectRepository(AddressExternal_ORM_Entity)
    private readonly ormRepository: Repository<AddressExternal_ORM_Entity>,
  ) {}

  // ============================== MAPPER ==========================================

  // ORM to Domain
  private toDomain(orm: AddressExternal_ORM_Entity): AddressExternal {
    return new AddressExternal(
      orm.nasabah,
      orm.alamat_ktp,
      orm.rt_rw,
      orm.kelurahan,
      orm.kecamatan,
      orm.kota,
      orm.provinsi,
      orm.status_rumah,
      orm.domisili,
      orm.rumah_domisili,
      orm.id,
      orm.created_at,
      orm.deleted_at,

      // Mutable
      orm.alamat_domisili,
      orm.biaya_perbulan,
      orm.biaya_pertahun,
      orm.biaya_perbulan_domisili,
      orm.biaya_pertahun_domisili,
      orm.lama_tinggal,
      orm.atas_nama_listrik,
      orm.hubungan,
      orm.foto_meteran_listrik,
      orm.share_loc_domisili,
      orm.share_loc_usaha,
      orm.share_loc_tempat_kerja,
      orm.validasi_alamat,
      orm.catatan,
      orm.updated_at,
    );
  }


  private toOrm(domain: AddressExternal): Partial<AddressExternal_ORM_Entity> {
    return {
      id: domain.id,
      nasabah: { id: domain.nasabah.id } as ClientExternal_ORM_Entity,
      alamat_ktp: domain.alamat_ktp,
      rt_rw: domain.rt_rw,
      kelurahan: domain.kelurahan,
      kecamatan: domain.kecamatan,
      kota: domain.kota,
      provinsi: domain.provinsi,
      status_rumah: domain.status_rumah,
      domisili: domain.domisili,
      rumah_domisili: domain.rumah_domisili,

      alamat_domisili: domain.alamat_domisili,
      biaya_perbulan: domain.biaya_perbulan,
      biaya_pertahun: domain.biaya_pertahun,
      biaya_perbulan_domisili: domain.biaya_perbulan_domisili,
      biaya_pertahun_domisili: domain.biaya_pertahun_domisili,
      lama_tinggal: domain.lama_tinggal,
      atas_nama_listrik: domain.atas_nama_listrik,
      hubungan: domain.hubungan,
      foto_meteran_listrik: domain.foto_meteran_listrik,
      share_loc_domisili: domain.share_loc_domisili,
      share_loc_usaha: domain.share_loc_usaha,
      share_loc_tempat_kerja: domain.share_loc_tempat_kerja,
      validasi_alamat: domain.validasi_alamat,
      catatan: domain.catatan,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }


  private toOrmPartial(
    partial: Partial<AddressExternal>,
  ): Partial<AddressExternal_ORM_Entity> {
    const orm: Partial<AddressExternal_ORM_Entity> = {};

    if (partial.nasabah)
      orm.nasabah = { id: partial.nasabah.id } as ClientExternal_ORM_Entity;
    if (partial.alamat_ktp) orm.alamat_ktp = partial.alamat_ktp;
    if (partial.rt_rw) orm.rt_rw = partial.rt_rw;
    if (partial.kelurahan) orm.kelurahan = partial.kelurahan;
    if (partial.kecamatan) orm.kecamatan = partial.kecamatan;
    if (partial.kota) orm.kota = partial.kota;
    if (partial.provinsi) orm.provinsi = partial.provinsi;
    if (partial.status_rumah) orm.status_rumah = partial.status_rumah;
    if (partial.domisili) orm.domisili = partial.domisili;
    if (partial.rumah_domisili) orm.rumah_domisili = partial.rumah_domisili;

    if (partial.alamat_domisili) orm.alamat_domisili = partial.alamat_domisili;
    if (partial.biaya_perbulan) orm.biaya_perbulan = partial.biaya_perbulan;
    if (partial.biaya_pertahun) orm.biaya_pertahun = partial.biaya_pertahun;
    if (partial.biaya_perbulan_domisili)
      orm.biaya_perbulan_domisili = partial.biaya_perbulan_domisili;
    if (partial.biaya_pertahun_domisili)
      orm.biaya_pertahun_domisili = partial.biaya_pertahun_domisili;
    if (partial.lama_tinggal) orm.lama_tinggal = partial.lama_tinggal;
    if (partial.atas_nama_listrik)
      orm.atas_nama_listrik = partial.atas_nama_listrik;
    if (partial.hubungan) orm.hubungan = partial.hubungan;
    if (partial.foto_meteran_listrik)
      orm.foto_meteran_listrik = partial.foto_meteran_listrik;
    if (partial.share_loc_domisili) orm.share_loc_domisili = partial.share_loc_domisili;
    if (partial.share_loc_usaha) orm.share_loc_usaha = partial.share_loc_usaha;
    if (partial.share_loc_tempat_kerja) orm.share_loc_tempat_kerja = partial.share_loc_tempat_kerja;
    if (partial.validasi_alamat) orm.validasi_alamat = partial.validasi_alamat;
    if (partial.catatan) orm.catatan = partial.catatan;
    if (partial.created_at) orm.created_at = partial.created_at;
    if (partial.updated_at) orm.updated_at = partial.updated_at;
    if (partial.deleted_at) orm.deleted_at = partial.deleted_at;

    return orm;
  }

  // ============================== METHODS =========================================

  async findById(id: number): Promise<AddressExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<AddressExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map(this.toDomain);
  }

  async save(address: AddressExternal): Promise<AddressExternal> {
    const ormEntity = this.toOrm(address);
    const saved = await this.ormRepository.save(ormEntity);
    return this.toDomain(saved);
  }

  async update(
    id: number,
    addressData: Partial<AddressExternal>,
  ): Promise<AddressExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(addressData));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('AddressExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<AddressExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['nasabah'],
    });
    return ormEntities.map(this.toDomain);
  }
}
