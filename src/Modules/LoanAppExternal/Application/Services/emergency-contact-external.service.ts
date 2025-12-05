import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  IEmergencyContactExternalRepository,
  EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/emergency-contact-external.repository';
import { EmergencyContactExternal } from '../../Domain/Entities/emergency-contact-external.entity';
import { CreateEmergencyContactExternalDto } from '../DTOS/dto-Emergency-Contact/create-emergency-contact.dto';
import { UpdateEmergencyContactExternalDto } from '../DTOS/dto-Emergency-Contact/update-emergency-contact.dto';

@Injectable()
export class EmergencyContactExternalService {
  constructor(
    @Inject(EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY)
    private readonly repo: IEmergencyContactExternalRepository,
  ) {}

  async create(
    dto: CreateEmergencyContactExternalDto,
  ): Promise<EmergencyContactExternal> {
    const now = new Date();

    if (
      !dto.nasabah_id ||
      !dto.nama_kontak_darurat ||
      !dto.no_hp_kontak_darurat
    ) {
      throw new BadRequestException('Field wajib tidak boleh kosong.');
    }

    const contact = new EmergencyContactExternal(
      { id: dto.nasabah_id },
      dto.nama_kontak_darurat,
      dto.hubungan_kontak_darurat,
      dto.no_hp_kontak_darurat,
      dto.validasi_kontak_darurat,
      undefined, // id
      now, // created_at
      now, // updated_at
      null, // deleted_at
    );

    try {
      return await this.repo.save(contact);
    } catch (error) {
      console.error('Create Emergency Contact Error:', error);
      throw new InternalServerErrorException('Gagal membuat kontak darurat');
    }
  }

  async update(
    id: number,
    dto: UpdateEmergencyContactExternalDto,
  ): Promise<EmergencyContactExternal> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Kontak darurat dengan ID ${id} tidak ditemukan`,
      );
    }

    // Gunakan interface ringan tanpa properti readonly
    const updateData: {
      nama_kontak_darurat?: string;
      hubungan_kontak_darurat?: string;
      no_hp_kontak_darurat?: string;
      validasi_kontak_darurat?: boolean;
      catatan?: string;
    } = {};

    if (dto.nama_kontak_darurat !== undefined) {
      updateData.nama_kontak_darurat = dto.nama_kontak_darurat;
    }

    if (dto.hubungan_kontak_darurat !== undefined) {
      updateData.hubungan_kontak_darurat = dto.hubungan_kontak_darurat;
    }

    if (dto.no_hp_kontak_darurat !== undefined) {
      updateData.no_hp_kontak_darurat = dto.no_hp_kontak_darurat;
    }

    if (dto.validasi_kontak_darurat !== undefined) {
      updateData.validasi_kontak_darurat = dto.validasi_kontak_darurat;
    }

    try {
      return await this.repo.update(id, updateData);
    } catch (error) {
      console.error('Update Emergency Contact Error:', error);
      throw new InternalServerErrorException('Gagal mengupdate kontak darurat');
    }
  }

  async findById(id: number): Promise<EmergencyContactExternal> {
    const contact = await this.repo.findById(id);
    if (!contact) {
      throw new NotFoundException(
        `Kontak darurat dengan ID ${id} tidak ditemukan`,
      );
    }
    return contact;
  }

  async findAll(): Promise<EmergencyContactExternal[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Emergency Contact Error:', error);
      throw new InternalServerErrorException(
        'Gagal mengambil data kontak darurat',
      );
    }
  }

  async delete(id: number): Promise<void> {
    const contact = await this.repo.findById(id);
    if (!contact) {
      throw new NotFoundException(
        `Kontak darurat dengan ID ${id} tidak ditemukan`,
      );
    }

    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Emergency Contact Error:', error);
      throw new InternalServerErrorException('Gagal menghapus kontak darurat');
    }
  }
}
