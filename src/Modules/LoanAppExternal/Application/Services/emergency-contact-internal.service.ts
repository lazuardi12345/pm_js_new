import { Injectable, Inject } from '@nestjs/common';
import {
    IEmergencyContactExternalRepository,
    EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
  } from '../../Domain/Repositories/emergency-contact-internal.repository'
import { EmergencyContactExternal } from '../../Domain/Entities/emergency-contact-internal.entity';
import { CreateEmergencyContactExternalDto } from '../DTOS/dto-Emergency-Contact/create-emergency-contact.dto';
import { UpdateEmergencyContactExternalDto } from '../DTOS/dto-Emergency-Contact/update-emergency-contact.dto';

@Injectable()
export class EmergencyContactExternalService {
  constructor(
    @Inject(EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY)
    private readonly repo: IEmergencyContactExternalRepository,
  ) {}

  async create(dto: CreateEmergencyContactExternalDto): Promise<EmergencyContactExternal> {
    const now = new Date();

    const address = new EmergencyContactExternal(
    dto.nasabah_id,                // nasabahId
    dto.nama_kontak_darurat,        // namaKontakDarurat
    dto.hubungan_kontak_darurat,    // hubunganKontakDarurat
    dto.no_hp_kontak_darurat,        // noHpKontakDarurat
    dto.validasi_kontak_darurat,    // validasiKontakDarurat (optional)
    dto.catatan,                  // catatan (optional)
    undefined,                    // id (optional)
    now,                          // createdAt
    now,                          // updatedAt
    null                          // deletedAt
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateEmergencyContactExternalDto,
  ): Promise<EmergencyContactExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<EmergencyContactExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<EmergencyContactExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
