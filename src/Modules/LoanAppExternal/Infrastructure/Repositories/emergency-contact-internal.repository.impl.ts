import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyContactExternal } from '../../Domain/Entities/emergency-contact-internal.entity';
import { IEmergencyContactExternalRepository } from '../../Domain/Repositories/emergency-contact-internal.repository';
import { EmergencyContactExternal_ORM_Entity } from '../Entities/emergency-contact.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class EmergencyContactExternalRepositoryImpl
  implements IEmergencyContactExternalRepository
{
  constructor(
    @InjectRepository(EmergencyContactExternal_ORM_Entity)
    private readonly ormRepository: Repository<EmergencyContactExternal_ORM_Entity>,
  ) {}

  private toDomain(
    ormEntity: EmergencyContactExternal_ORM_Entity,
  ): EmergencyContactExternal {
    return new EmergencyContactExternal(
      ormEntity.nasabah.id,
      ormEntity.nama_kontak_darurat,
      ormEntity.hubungan_kontak_darurat,
      ormEntity.no_hp_kontak_darurat,
      ormEntity.validasi_kontak_darurat,
      ormEntity.catatan,
      ormEntity.id,
      ormEntity.created_at,
      ormEntity.updated_at,
      ormEntity.deleted_at,
    );
  }

  private toOrm(
    domainEntity: EmergencyContactExternal,
  ): Partial<EmergencyContactExternal_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: { id: domainEntity.nasabahId } as ClientExternal_ORM_Entity,
      nama_kontak_darurat: domainEntity.namaKontakDarurat,
      hubungan_kontak_darurat: domainEntity.hubunganKontakDarurat,
      no_hp_kontak_darurat: domainEntity.noHpKontakDarurat,
      validasi_kontak_darurat: domainEntity.validasiKontakDarurat,
      catatan: domainEntity.catatan,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
      deleted_at: domainEntity.deletedAt,
    };
  }

  private toOrmPartial(
    partial: Partial<EmergencyContactExternal>,
  ): Partial<EmergencyContactExternal_ORM_Entity> {
    const ormData: Partial<EmergencyContactExternal_ORM_Entity> = {};

    if (partial.nasabahId)
      ormData.nasabah = { id: partial.nasabahId } as ClientExternal_ORM_Entity;
    if (partial.namaKontakDarurat)
      ormData.nama_kontak_darurat = partial.namaKontakDarurat;
    if (partial.hubunganKontakDarurat)
      ormData.hubungan_kontak_darurat = partial.hubunganKontakDarurat;
    if (partial.noHpKontakDarurat)
      ormData.no_hp_kontak_darurat = partial.noHpKontakDarurat;
    if (partial.validasiKontakDarurat !== undefined)
      ormData.validasi_kontak_darurat = partial.validasiKontakDarurat;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.createdAt) ormData.created_at = partial.createdAt;
    if (partial.updatedAt) ormData.updated_at = partial.updatedAt;
    if (partial.deletedAt) ormData.deleted_at = partial.deletedAt;

    return ormData;
  }

  async findById(id: number): Promise<EmergencyContactExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<EmergencyContactExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<EmergencyContactExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['nasabah'],
    });
    return ormEntities.map((entity) => this.toDomain(entity));
  }

  async save(
    contact: EmergencyContactExternal,
  ): Promise<EmergencyContactExternal> {
    const ormEntity = this.toOrm(contact);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm as EmergencyContactExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<EmergencyContactExternal>,
  ): Promise<EmergencyContactExternal> {
    await this.ormRepository.update(id, this.toOrmPartial(data));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('EmergencyContactExternal not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
