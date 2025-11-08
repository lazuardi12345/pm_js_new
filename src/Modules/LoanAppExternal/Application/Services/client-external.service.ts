import { Injectable, Inject } from '@nestjs/common';
import {
  IClientExternalRepository,
  CLIENT_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/client-external.repository';
import { ClientExternal } from '../../Domain/Entities/client-external.entity';
import { CreateClientExternalDto } from '../DTOS/dto-ClientExternal/create-client-external.dto';
import { UpdateClientExternalDto } from '../DTOS/dto-ClientExternal/update-client-external.dto';
import { GENDER, MARRIAGE_STATUS } from 'src/Shared/Enums/External/Client-External.enum';

@Injectable()
export class ClientExternalService {
  constructor(
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly repo: IClientExternalRepository,
  ) {}

  async create(dto: CreateClientExternalDto): Promise<ClientExternal> {
    const now = new Date();

    const client = new ClientExternal(
      { id: dto.marketing_id },          
      dto.nama_lengkap,
      dto.nik,
      dto.no_kk,
      dto.no_rek || '',                  
      dto.foto_rekening || '',
      dto.jenis_kelamin as GENDER,
      dto.tempat_lahir,
      dto.tanggal_lahir,
      dto.no_hp,
      dto.status_nikah as MARRIAGE_STATUS,
      undefined,                   
      dto.email,
      dto.foto_ktp_peminjam,
      dto.foto_ktp_penjamin,
      dto.foto_kk_peminjam,
      dto.foto_kk_penjamin,
      dto.dokumen_pendukung,
      dto.validasi_nasabah,
      dto.catatan,
      now,                              // created_at
      now,                              // updated_at
      null,                             // deleted_at
    );

    return this.repo.save(client);
  }

  async update(
    id: number,
    dto: UpdateClientExternalDto,
  ): Promise<ClientExternal> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`ClientExternal with ID ${id} not found`);
    }

    // Merge fields optional
    const updated: Partial<ClientExternal> = {
      nama_lengkap: dto.nama_lengkap ?? existing.nama_lengkap,
      nik: dto.nik ?? existing.nik,
      no_kk: dto.no_kk ?? existing.no_kk,
      no_rek: dto.no_rek ?? existing.no_rek,
      foto_rekening: dto.foto_rekening ?? existing.foto_rekening,
      jenis_kelamin: dto.jenis_kelamin ?? existing.jenis_kelamin,
      tempat_lahir: dto.tempat_lahir ?? existing.tempat_lahir,
      tanggal_lahir: dto.tanggal_lahir ?? existing.tanggal_lahir,
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
      updated_at: new Date(),
    };

    return this.repo.update(id, updated);
  }

  async findById(id: number): Promise<ClientExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ClientExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
