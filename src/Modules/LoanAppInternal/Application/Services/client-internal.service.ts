import { Injectable, Inject } from '@nestjs/common';
import {
  IClientInternalRepository,
  CLIENT_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/client-internal.repository';
import { ClientInternal } from '../../Domain/Entities/client-internal.entity';
import { CreateClientInternalDto } from '../DTOS/dto-ClientInternal/create-client-internal.dto';
import { UpdateClientInternalDto } from '../DTOS/dto-ClientInternal/update-client-internal.dto';

@Injectable()
export class ClientInternalService {
  constructor(
    @Inject(CLIENT_INTERNAL_REPOSITORY)
    private readonly repo: IClientInternalRepository,
  ) {}

  async create(dto: CreateClientInternalDto): Promise<ClientInternal> {
    const now = new Date();
    const client_internal = new ClientInternal(
      {id: dto.marketing_id},
      dto.nama_lengkap, 
      dto.no_ktp,
      dto.jenis_kelamin, 
      dto.tempat_lahir, 
      new Date(dto.tanggal_lahir), 
      dto.no_hp, // noHp
      dto.status_nikah,
      undefined, // id
      dto.email, // email (opsional)
      dto.foto_ktp, // fotoKtp (opsional)
      dto.foto_kk, // fotoKk (opsional)
      dto.foto_id_card, // fotoIdCard (opsional)
      dto.foto_rekening, // fotoRekening (opsional)
      dto.no_rekening, // noRekening (opsional)
      dto.enable_edit ?? false, // enableEdit (default: false)
      dto.points, // points (opsional)
      now, // createdAt (opsional, bisa di-set otomatis di repo)
      now, // updatedAt (opsional, bisa di-set otomatis di repo)
      null, // deletedAt (opsional, bisa di-set otomatis di repo)
    );
    return this.repo.save(client_internal);
  }

  async update(
    id: number,
    dto: UpdateClientInternalDto,
  ): Promise<ClientInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<ClientInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ClientInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
