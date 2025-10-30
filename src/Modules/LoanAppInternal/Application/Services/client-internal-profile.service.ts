import { Injectable, Inject } from '@nestjs/common';
import { CLIENT_INTERNAL_PROFILE_REPOSITORY } from '../../Domain/Repositories/client-internal-profile.repository';
import { IClientInternalProfileRepository } from '../../Domain/Repositories/client-internal-profile.repository';
import { CreateClientInternalProfileDto } from '../DTOS/dto-ClientInternalProfile/create-client-internal-profile.dto';
import { UpdateClientInternalProfileDto } from '../DTOS/dto-ClientInternalProfile/update-client-internal-profile.dto';
import { ClientInternalProfile } from '../../Domain/Entities/client-internal-profile.entity';
@Injectable()
export class ClientInternalProfileService {
  constructor(
    @Inject(CLIENT_INTERNAL_PROFILE_REPOSITORY)
    private readonly repo: IClientInternalProfileRepository,
  ) {}

  async create(
    dto: CreateClientInternalProfileDto,
  ): Promise<ClientInternalProfile> {
    const now = new Date();
    const client_internal_profile = new ClientInternalProfile(
      { id: dto.user_id },
      dto.nama_lengkap,
      dto.jenis_kelamin,
      dto.no_hp, // noHp
      dto.status_nikah,
      undefined, // id
      dto.email, // email (opsional)
      dto.foto_ktp, // fotoKtp (opsional)
      dto.foto_kk, // fotoKk (opsional)
      dto.foto_id_card, // fotoIdCard (opsional)
      dto.foto_rekening, // fotoRekening (opsional)
      dto.no_rekening, // noRekening (opsional)
      now, // createdAt (opsional, bisa di-set otomatis di repo)
      now, // updatedAt (opsional, bisa di-set otomatis di repo)
      null, // deletedAt (opsional, bisa di-set otomatis di repo)
    );
    return this.repo.save(client_internal_profile);
  }

  async update(
    id: number,
    dto: UpdateClientInternalProfileDto,
  ): Promise<ClientInternalProfile> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<ClientInternalProfile | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ClientInternalProfile[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
