import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressExternal } from '../../Domain/Entities/address-external.entity';
import { IAddressExternalRepository } from '../../Domain/Repositories/address-external.repository';
import { AddressExternal_ORM_Entity } from '../Entities/address-external.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class AddressExternalRepositoryImpl implements IAddressExternalRepository {
  constructor(
    @InjectRepository(AddressExternal_ORM_Entity)
    private readonly ormRepository: Repository<AddressExternal_ORM_Entity>,
  ) {}

  // MAPPER =======================================================================
  private toDomain(ormEntity: AddressExternal_ORM_Entity): AddressExternal {
    return new AddressExternal(
      ormEntity.nasabah.id,
      ormEntity.alamat_ktp,
      ormEntity.rt_rw,
      ormEntity.kelurahan,
      ormEntity.kecamatan,
      ormEntity.kota,
      ormEntity.provinsi,
      ormEntity.status_rumah,
      ormEntity.domisili,
      ormEntity.rumah_domisili,
      ormEntity.id,
      ormEntity.alamat_domisili,
      ormEntity.biaya_perbulan,
      ormEntity.biaya_pertahun,
      ormEntity.biaya_perbulan_domisili,
      ormEntity.biaya_pertahun_domisili,
      ormEntity.lama_tinggal,
      ormEntity.atas_nama_listrik,
      ormEntity.hubungan,
      ormEntity.foto_meteran_listrik,
      ormEntity.share_loc_link,
      ormEntity.validasi_alamat,
      ormEntity.catatan,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(domainEntity: AddressExternal): Partial<AddressExternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabahId } as ClientExternal_ORM_Entity,
      alamat_ktp: domainEntity.alamatKtp,
      rt_rw: domainEntity.rtRw,
      kelurahan: domainEntity.kelurahan,
      kecamatan: domainEntity.kecamatan,
      kota: domainEntity.kota,
      provinsi: domainEntity.provinsi,
      status_rumah: domainEntity.statusRumah,
      domisili: domainEntity.domisili,
      rumah_domisili: domainEntity.rumahDomisili,
      alamat_domisili: domainEntity.alamatDomisili,
      biaya_perbulan: domainEntity.biayaPerBulan,
      biaya_pertahun: domainEntity.biayaPerTahun,
      biaya_perbulan_domisili: domainEntity.biayaPerBulanDomisili,
      biaya_pertahun_domisili: domainEntity.biayaPerTahunDomisili,
      lama_tinggal: domainEntity.lamaTinggal,
      atas_nama_listrik: domainEntity.atasNamaListrik,
      hubungan: domainEntity.hubungan,
      foto_meteran_listrik: domainEntity.fotoMeteranListrik,
      share_loc_link: domainEntity.shareLocLink,
      validasi_alamat: domainEntity.validasiAlamat,
      catatan: domainEntity.catatan,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(partial: Partial<AddressExternal>): Partial<AddressExternal_ORM_Entity> {
    const ormData: Partial<AddressExternal_ORM_Entity> = {};

    if (partial.nasabahId)
      ormData.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.alamatKtp) ormData.alamat_ktp = partial.alamatKtp;
    if (partial.rtRw) ormData.rt_rw = partial.rtRw;
    if (partial.kelurahan) ormData.kelurahan = partial.kelurahan;
    if (partial.kecamatan) ormData.kecamatan = partial.kecamatan;
    if (partial.kota) ormData.kota = partial.kota;
    if (partial.provinsi) ormData.provinsi = partial.provinsi;
    if (partial.statusRumah) ormData.status_rumah = partial.statusRumah;
    if (partial.domisili) ormData.domisili = partial.domisili;
    if (partial.rumahDomisili) ormData.rumah_domisili = partial.rumahDomisili;
    if (partial.alamatDomisili) ormData.alamat_domisili = partial.alamatDomisili;
    if (partial.biayaPerBulan) ormData.biaya_perbulan = partial.biayaPerBulan;
    if (partial.biayaPerTahun) ormData.biaya_pertahun = partial.biayaPerTahun;
    if (partial.biayaPerBulanDomisili) ormData.biaya_perbulan_domisili = partial.biayaPerBulanDomisili;
    if (partial.biayaPerTahunDomisili) ormData.biaya_pertahun_domisili = partial.biayaPerTahunDomisili;
    if (partial.lamaTinggal) ormData.lama_tinggal = partial.lamaTinggal;
    if (partial.atasNamaListrik) ormData.atas_nama_listrik = partial.atasNamaListrik;
    if (partial.hubungan) ormData.hubungan = partial.hubungan;
    if (partial.fotoMeteranListrik) ormData.foto_meteran_listrik = partial.fotoMeteranListrik;
    if (partial.shareLocLink) ormData.share_loc_link = partial.shareLocLink;
    if (partial.validasiAlamat) ormData.validasi_alamat = partial.validasiAlamat;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }
  // ============================================================================

  async findById(id: number): Promise<AddressExternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id }, relations: ['nasabah'] });
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
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(id: number, addressData: Partial<AddressExternal>): Promise<AddressExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(addressData));
    const updated = await this.ormRepository.findOne({ where: { id }, relations: ['nasabah'] });
    if (!updated) throw new Error('AddressExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<AddressExternal[]> {
    const ormEntities = await this.ormRepository.find({ relations: ['nasabah'] });
    return ormEntities.map(this.toDomain);
  }
}
