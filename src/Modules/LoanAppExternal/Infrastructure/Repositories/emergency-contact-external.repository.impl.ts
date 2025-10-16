import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyContactExternal } from '../../Domain/Entities/emergency-contact-external.entity';
import { IEmergencyContactExternalRepository } from '../../Domain/Repositories/emergency-contact-external.repository';
import { EmergencyContactExternal_ORM_Entity } from '../Entities/emergency-contact.orm-entity';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';

@Injectable()
export class EmergencyContactExternalRepositoryImpl
  implements IEmergencyContactExternalRepository {
  constructor(
    @InjectRepository(EmergencyContactExternal_ORM_Entity)
    private readonly orm_repository: Repository<EmergencyContactExternal_ORM_Entity>,
  ) { }

  // ========================== MAPPER ==========================

  private to_domain(
    orm_entity: EmergencyContactExternal_ORM_Entity,
  ): any {
    return {
      id: orm_entity.id,
      nasabah: {
        id: orm_entity.nasabah.id,
        marketing: orm_entity.nasabah.marketing
          ? { id: orm_entity.nasabah.marketing.id }
          : null,
      },
      nama_kontak_darurat: orm_entity.nama_kontak_darurat,
      hubungan_kontak_darurat: orm_entity.hubungan_kontak_darurat,
      no_hp_kontak_darurat: orm_entity.no_hp_kontak_darurat,
      validasi_kontak_darurat: orm_entity.validasi_kontak_darurat,
      catatan: orm_entity.catatan,
      created_at: orm_entity.created_at,
      updated_at: orm_entity.updated_at,
      deleted_at: orm_entity.deleted_at,
    };
  }


  private to_orm(
    domain_entity: EmergencyContactExternal,
  ): Partial<EmergencyContactExternal_ORM_Entity> {
    return {
      id: domain_entity.id,
      nasabah: { id: domain_entity.nasabah.id } as ClientExternal_ORM_Entity,
      nama_kontak_darurat: domain_entity.nama_kontak_darurat,
      hubungan_kontak_darurat: domain_entity.hubungan_kontak_darurat,
      no_hp_kontak_darurat: domain_entity.no_hp_kontak_darurat,
      validasi_kontak_darurat: domain_entity.validasi_kontak_darurat,
      catatan: domain_entity.catatan,
      created_at: domain_entity.created_at,
      updated_at: domain_entity.updated_at,
      deleted_at: domain_entity.deleted_at,
    };
  }

  private to_orm_partial(
    partial: Partial<EmergencyContactExternal>,
  ): Partial<EmergencyContactExternal_ORM_Entity> {
    const orm_data: Partial<EmergencyContactExternal_ORM_Entity> = {};

    if (partial.nasabah)
      orm_data.nasabah = { id: partial.nasabah.id } as ClientExternal_ORM_Entity;
    if (partial.nama_kontak_darurat)
      orm_data.nama_kontak_darurat = partial.nama_kontak_darurat;
    if (partial.hubungan_kontak_darurat)
      orm_data.hubungan_kontak_darurat = partial.hubungan_kontak_darurat;
    if (partial.no_hp_kontak_darurat)
      orm_data.no_hp_kontak_darurat = partial.no_hp_kontak_darurat;
    if (partial.validasi_kontak_darurat !== undefined)
      orm_data.validasi_kontak_darurat = partial.validasi_kontak_darurat;
    if (partial.catatan) orm_data.catatan = partial.catatan;
    if (partial.created_at) orm_data.created_at = partial.created_at;
    if (partial.updated_at) orm_data.updated_at = partial.updated_at;
    if (partial.deleted_at) orm_data.deleted_at = partial.deleted_at;

    return orm_data;
  }

  // ========================== REPOSITORY METHODS ==========================

  async findById(id: number): Promise<EmergencyContactExternal | null> {
    const orm_entity = await this.orm_repository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    return orm_entity ? this.to_domain(orm_entity) : null;
  }

  async findByNasabahId(nasabahId: number): Promise<EmergencyContactExternal[]> {
    const orm_entities = await this.orm_repository.find({
      where: { nasabah: { id: nasabahId } },
      relations: ['nasabah'],
    });
    return orm_entities.map(this.to_domain.bind(this));
  }

  async findAll():Promise<any[]> {
  const orm_entities = await this.orm_repository.find({
    relations: ['nasabah', 'nasabah.marketing'],
  });
  return orm_entities.map(this.to_domain.bind(this));
}

  async save(
    contact: EmergencyContactExternal,
  ): Promise<EmergencyContactExternal> {
    const orm_entity = this.to_orm(contact);
    const saved = await this.orm_repository.save(orm_entity);
    return this.to_domain(saved as EmergencyContactExternal_ORM_Entity);
  }

  async update(
    id: number,
    data: Partial<EmergencyContactExternal>,
  ): Promise<EmergencyContactExternal> {
    await this.orm_repository.update(id, this.to_orm_partial(data));
    const updated = await this.orm_repository.findOne({
      where: { id },
      relations: ['nasabah'],
    });
    if (!updated) throw new Error('EmergencyContactExternal not found');
    return this.to_domain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.orm_repository.softDelete(id);
  }
}