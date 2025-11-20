import { Injectable, Inject } from '@nestjs/common';
import {
  IClientExternalRepository,
  CLIENT_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/client-external.repository';
import { ClientExternal } from '../../Domain/Entities/client-external.entity';
import { CreateClientExternalDto } from '../DTOS/dto-ClientExternal/create-client-external.dto';
import { UpdateClientExternalDto } from '../DTOS/dto-ClientExternal/update-client-external.dto';
import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';

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
      dto.tempat_lahir,
      dto.tanggal_lahir,
      undefined,
      dto.points,
      now, // created_at
      now, // updated_at
      null, // deleted_at
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
      jenis_kelamin: dto.jenis_kelamin ?? existing.jenis_kelamin,
      tempat_lahir: dto.tempat_lahir ?? existing.tempat_lahir,
      tanggal_lahir: dto.tanggal_lahir ?? existing.tanggal_lahir,
      no_hp: dto.no_hp ?? existing.no_hp,
      status_nikah: dto.status_nikah ?? existing.status_nikah,
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
