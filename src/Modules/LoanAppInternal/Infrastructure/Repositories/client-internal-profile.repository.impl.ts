import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientInternalProfile } from '../../Domain/Entities/client-internal-profile.entity';
import { IClientInternalProfileRepository } from '../../Domain/Repositories/client-internal-profile.repository';
import { ClientInternalProfile_ORM_Entity } from '../Entities/client-internal-profile.orm-entity';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
@Injectable()
export class ClientInternalProfileRepositoryImpl
  implements IClientInternalProfileRepository
{
  constructor(
    @InjectRepository(ClientInternalProfile_ORM_Entity)
    private readonly ormRepository: Repository<ClientInternalProfile_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(
    orm: ClientInternalProfile_ORM_Entity,
  ): ClientInternalProfile {
    return new ClientInternalProfile(
      orm.nasabah,
      orm.pengajuan,
      orm.nama_lengkap,
      orm.jenis_kelamin,
      orm.no_hp,
      orm.status_nikah,
      orm.id,
      orm.email,
      orm.foto_ktp,
      orm.foto_kk,
      orm.foto_id_card,
      orm.foto_rekening,
      orm.no_rekening,
      orm.created_at ?? new Date(), // fallback kalau undefined
      orm.updated_at ?? new Date(),
      orm.deleted_at ?? null,
    );
  }

  //? All Transactions that using for Create datas

  private toOrm(
    domainEntity: ClientInternalProfile,
  ): Partial<ClientInternalProfile_ORM_Entity> {
    return {
      id: domainEntity.id,
      nasabah: {
        id: domainEntity.nasabah.id,
      } as ClientInternal_ORM_Entity,
      nama_lengkap: domainEntity.nama_lengkap,
      jenis_kelamin: domainEntity.jenis_kelamin,
      no_hp: domainEntity.no_hp,
      status_nikah: domainEntity.status_nikah,
      email: domainEntity.email,
      foto_ktp: domainEntity.foto_ktp,
      foto_kk: domainEntity.foto_kk,
      foto_id_card: domainEntity.foto_id_card,
      foto_rekening: domainEntity.foto_rekening,
      no_rekening: domainEntity.no_rekening,
      created_at: domainEntity.created_at,
      updated_at: domainEntity.updated_at,
      deleted_at: domainEntity.deleted_at,
    };
  }

  //? All Transactions that using for Partial Update like PATCH or Delete

  private toOrmPartial(
    partial: Partial<ClientInternalProfile>,
  ): Partial<ClientInternalProfile_ORM_Entity> {
    const ormData: Partial<ClientInternalProfile_ORM_Entity> = {};

    if (partial.nama_lengkap) ormData.nama_lengkap! = partial.nama_lengkap;
    if (partial.jenis_kelamin) ormData.jenis_kelamin = partial.jenis_kelamin;
    if (partial.no_hp) ormData.no_hp = partial.no_hp;
    if (partial.status_nikah) ormData.status_nikah = partial.status_nikah;
    if (partial.email) ormData.email = partial.email;
    if (partial.foto_ktp) ormData.foto_ktp = partial.foto_ktp;
    if (partial.foto_kk) ormData.foto_kk = partial.foto_kk;
    if (partial.foto_id_card) ormData.foto_id_card = partial.foto_id_card;
    if (partial.foto_rekening) ormData.foto_rekening = partial.foto_rekening;
    if (partial.no_rekening) ormData.no_rekening = partial.no_rekening;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<ClientInternalProfile | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  // async findByMarketingId(
  //   marketingId: number,
  // ): Promise<ClientInternalProfile[]> {
  //   const ormEntities = await this.ormRepository.find({
  //     where: { marketing: { id: marketingId } },
  //   });
  //   return ormEntities.map(this.toDomain);
  // }

  async save(
    client_internal: ClientInternalProfile,
  ): Promise<ClientInternalProfile> {
    const ormEntity = this.toOrm(client_internal);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    client_internalData: Partial<ClientInternalProfile>,
  ): Promise<ClientInternalProfile> {
    await this.ormRepository.update(id, this.toOrmPartial(client_internalData));
    const updated = await this.ormRepository.findOne({
      where: { id },
      relations: ['marketing'],
    });
    if (!updated) throw new Error('Address not found');
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<ClientInternalProfile[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
