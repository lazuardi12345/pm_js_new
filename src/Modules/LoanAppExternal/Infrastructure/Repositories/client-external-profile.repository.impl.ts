import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClientExternalProfileRepository } from '../../Domain/Repositories/client-external-profile.repository';
import { ClientExternalProfile } from '../../Domain/Entities/client-external-profile.entity';
import { ClientExternalProfile_ORM_Entity } from '../Entities/client-external-profile.orm-entity';

@Injectable()
export class ClientExternalProfileRepositoryImpl
  implements IClientExternalProfileRepository
{
  constructor(
    @InjectRepository(ClientExternalProfile_ORM_Entity)
    private readonly ormRepository: Repository<ClientExternalProfile_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  private toDomain(
    orm: ClientExternalProfile_ORM_Entity,
  ): ClientExternalProfile {
    return new ClientExternalProfile(
      orm.nasabah,
      orm.pengajuan,
      orm.nama_lengkap,
      orm.no_rek,
      orm.jenis_kelamin,
      orm.no_hp,
      orm.status_nikah,
      orm.id,
      orm.email,
      orm.foto_rekening,
      orm.foto_ktp_peminjam,
      orm.foto_ktp_penjamin,
      orm.foto_kk_peminjam,
      orm.foto_kk_penjamin,
      orm.dokumen_pendukung,
      orm.validasi_nasabah,
      orm.catatan,
      orm.enable_edit,
      orm.created_at ?? new Date(),
      orm.updated_at ?? new Date(),
      orm.deleted_at ?? null,
    );
  }

  private toOrmPartial(
    partial: Partial<ClientExternalProfile>,
  ): Partial<ClientExternalProfile_ORM_Entity> {
    const ormData: Partial<ClientExternalProfile_ORM_Entity> = {};

    if (partial.nama_lengkap) ormData.nama_lengkap = partial.nama_lengkap;
    if (partial.no_rek) ormData.no_rek = partial.no_rek;
    if (partial.foto_rekening) ormData.foto_rekening = partial.foto_rekening;
    if (partial.jenis_kelamin) ormData.jenis_kelamin = partial.jenis_kelamin;
    if (partial.no_hp) ormData.no_hp = partial.no_hp;
    if (partial.status_nikah) ormData.status_nikah = partial.status_nikah;
    if (partial.email) ormData.email = partial.email;
    if (partial.foto_ktp_peminjam)
      ormData.foto_ktp_peminjam = partial.foto_ktp_peminjam;
    if (partial.foto_ktp_penjamin)
      ormData.foto_ktp_penjamin = partial.foto_ktp_penjamin;
    if (partial.foto_kk_peminjam)
      ormData.foto_kk_peminjam = partial.foto_kk_peminjam;
    if (partial.foto_kk_penjamin)
      ormData.foto_kk_penjamin = partial.foto_kk_penjamin;
    if (partial.dokumen_pendukung)
      ormData.dokumen_pendukung = partial.dokumen_pendukung;
    if (partial.validasi_nasabah !== undefined)
      ormData.validasi_nasabah = partial.validasi_nasabah;
    if (partial.catatan) ormData.catatan = partial.catatan;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined)
      ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<ClientExternalProfile | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['marketing'],
    });

    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  // async findByMarketingId(
  //   marketingId: number,
  // ): Promise<ClientExternalProfile[]> {
  //   const ormEntities = await this.ormRepository.find({
  //     where: { marketing: { id: marketingId } },
  //     relations: ['marketing'],
  //   });

  //   return ormEntities.map((orm) => this.toDomain(orm));
  // }

  async findAll(): Promise<ClientExternalProfile[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['marketing'],
    });
    return ormEntities.map((orm) => this.toDomain(orm));
  }

  async save(
    client_external: ClientExternalProfile,
  ): Promise<ClientExternalProfile> {
    const ormData = this.toOrmPartial(client_external);
    const saved = await this.ormRepository.save(ormData);
    return this.toDomain(saved);
  }

  async update(
    id: number,
    client_externalData: Partial<ClientExternalProfile>,
  ): Promise<ClientExternalProfile> {
    await this.ormRepository.update(id, this.toOrmPartial(client_externalData));

    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['marketing'],
    });

    if (!updated) throw new Error('Data not found');

    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
