import { Injectable, Inject } from '@nestjs/common';
import {
  IClientExternalRepository,
  CLIENT_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/client-external.repository';
import { ClientExternal } from '../../Domain/Entities/client-external.entity';
import { CreateClientExternalDto } from '../DTOS/dto-ClientExternal/create-client-external.dto';
import { UpdateClientExternalDto } from '../DTOS/dto-ClientExternal/update-client-external.dto';

@Injectable()
export class ClientExternalService {
  constructor(
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly repo: IClientExternalRepository,
  ) {}

  async create(dto: CreateClientExternalDto): Promise<ClientExternal> {
    const now = new Date();

    const address = new ClientExternal(
      {id: dto.marketing_id!}, // marketingId
      dto.nama_lengkap, // namaLengkap
      dto.nik, // nik
      dto.no_kk, // noKk
      dto.jenis_kelamin, // jenisKelamin
      dto.tempat_lahir, // tempatLahir
      dto.tanggal_lahir, // tanggalLahir
      dto.no_hp, // noHp
      dto.status_nikah, // statusNikah
      dto.email, // email (optional)
      dto.foto_ktp, // fotoKtp (optional)
      dto.foto_kk, // fotoKk (optional)
      dto.dokumen_pendukung, // dokumenPendukung (optional)
      dto.validasi_nasabah, // validasiNasabah (optional)
      dto.catatan, // catatan (optional)
      undefined, // id (optional)
      now, // createdAt
      now, // updatedAt
      null, // deletedAt
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateClientExternalDto,
  ): Promise<ClientExternal> {
    return this.repo.update(id, dto);
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
