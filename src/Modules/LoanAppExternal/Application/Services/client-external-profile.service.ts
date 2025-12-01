import { Injectable, Inject } from '@nestjs/common';
import { ClientExternalProfile } from '../../Domain/Entities/client-external-profile.entity';
import { CreateClientExternalProfileDto } from '../DTOS/dto-ClientExternalProfile/create-client-external-profile.dto';
import { UpdateClientExternalProfileDto } from '../DTOS/dto-ClientExternalProfile/update-client-external-profile.dto';
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';
import {
  CLIENT_EXTERNAL_PROFILE_REPOSITORY,
  IClientExternalProfileRepository,
} from '../../Domain/Repositories/client-external-profile.repository';

@Injectable()
export class ClientExternalProfileService {
  constructor(
    @Inject(CLIENT_EXTERNAL_PROFILE_REPOSITORY)
    private readonly repo: IClientExternalProfileRepository,
  ) {}

  async create(
    dto: CreateClientExternalProfileDto,
  ): Promise<ClientExternalProfile> {
    const now = new Date();

    const client = new ClientExternalProfile(
      { id: dto.nasabah_id },
      { id: dto.pengajuan_id },
      dto.nama_lengkap,
      dto.no_rek,
      dto.jenis_kelamin as GENDER,
      dto.no_hp,
      dto.status_nikah as MARRIAGE_STATUS,
      undefined,
      dto.email,
      dto.foto_rekening,
      dto.foto_ktp_peminjam,
      dto.foto_ktp_penjamin,
      dto.foto_kk_peminjam,
      dto.foto_kk_penjamin,
      dto.dokumen_pendukung,
      dto.validasi_nasabah,
      dto.catatan,
      dto.enable_edit,
      now, // created_at
      now, // updated_at
      null, // deleted_at
    );

    return this.repo.save(client);
  }

  async update(
    id: number,
    dto: UpdateClientExternalProfileDto,
  ): Promise<ClientExternalProfile> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`ClientExternal with ID ${id} not found`);
    }

    // Merge fields optional
    const updated: Partial<ClientExternalProfile> = {
      nasabah: { id: dto.nasabah_id ?? dto.nasabah_id },
      pengajuan: { id: dto.pengajuan_id ?? dto.pengajuan_id },
      nama_lengkap: dto.nama_lengkap ?? existing.nama_lengkap,
      no_rek: dto.no_rek ?? existing.no_rek,
      foto_rekening: dto.foto_rekening ?? existing.foto_rekening,
      jenis_kelamin: dto.jenis_kelamin ?? existing.jenis_kelamin,
      no_hp: dto.no_hp ?? existing.no_hp,
      status_nikah: dto.status_nikah ?? existing.status_nikah,
      email: dto.email ?? existing.email,
      foto_ktp_peminjam: dto.foto_ktp_peminjam ?? existing.foto_ktp_peminjam,
      foto_ktp_penjamin: dto.foto_ktp_penjamin ?? existing.foto_ktp_penjamin,
      foto_kk_peminjam: dto.foto_kk_peminjam ?? existing.foto_kk_peminjam,
      foto_kk_penjamin: dto.foto_kk_penjamin ?? existing.foto_kk_penjamin,
      dokumen_pendukung: dto.dokumen_pendukung ?? existing.dokumen_pendukung,
      validasi_nasabah: dto.validasi_nasabah ?? existing.validasi_nasabah,
      catatan: dto.catatan ?? existing.catatan,
      enable_edit: dto.enable_edit ?? existing.enable_edit,
      updated_at: new Date(),
    };

    return this.repo.update(id, updated);
  }

  async findById(id: number): Promise<ClientExternalProfile | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ClientExternalProfile[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
