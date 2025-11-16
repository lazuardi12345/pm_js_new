import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientInternal } from '../../Domain/Entities/client-internal.entity';
import { IClientInternalRepository } from '../../Domain/Repositories/client-internal.repository';
import { ClientInternal_ORM_Entity } from '../Entities/client-internal.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
@Injectable()
export class ClientInternalRepositoryImpl implements IClientInternalRepository {
  constructor(
    @InjectRepository(ClientInternal_ORM_Entity)
    private readonly ormRepository: Repository<ClientInternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  //? All Transactions that using for get datas

  private toDomain(orm: ClientInternal_ORM_Entity): ClientInternal {
    return new ClientInternal(
      orm.marketing,
      orm.nama_lengkap,
      orm.no_ktp,
      orm.jenis_kelamin,
      orm.tempat_lahir,
      orm.tanggal_lahir,
      orm.id,
      orm.enable_edit,
      orm.points,
      orm.created_at ?? new Date(), // fallback kalau undefined
      orm.updated_at ?? new Date(),
      orm.deleted_at ?? null,
    );
  }

  //? All Transactions that using for Create datas

  // private toOrm(
  //   domainEntity: ClientInternal,
  // ): Partial<ClientInternal_ORM_Entity> {
  //   return {
  //     id: domainEntity.id,
  //     marketing: { id: domainEntity.marketingId } as Users_ORM_Entity,
  //     nama_lengkap: domainEntity.namaLengkap,
  //     no_ktp: domainEntity.noKtp,
  //     jenis_kelamin: domainEntity.jenisKelamin,
  //     tempat_lahir: domainEntity.tempatLahir,
  //     tanggal_lahir: domainEntity.tanggalLahir,
  //     no_hp: domainEntity.noHp,
  //     status_nikah: domainEntity.statusNikah,
  //     email: domainEntity.email,
  //     foto_ktp: domainEntity.fotoKtp,
  //     foto_kk: domainEntity.fotoKk,
  //     foto_id_card: domainEntity.fotoIdCard,
  //     foto_rekening: domainEntity.fotoRekening,
  //     no_rekening: domainEntity.noRekening,
  //     enable_edit: domainEntity.enableEdit,
  //     points: domainEntity.points,
  //     created_at: domainEntity.createdAt,
  //     updated_at: domainEntity.updatedAt,
  //     deleted_at: domainEntity.deletedAt,
  //   };
  // }

  //? All Transactions that using for Partial Update like PATCH or Delete

  private toOrmPartial(
    partial: Partial<ClientInternal>,
  ): Partial<ClientInternal_ORM_Entity> {
    const ormData: Partial<ClientInternal_ORM_Entity> = {};

    if (partial.marketing)
      ormData.marketing! = { id: partial.marketing.id } as Users_ORM_Entity;
    if (partial.nama_lengkap) ormData.nama_lengkap! = partial.nama_lengkap;
    if (partial.no_ktp) ormData.no_ktp = partial.no_ktp;
    if (partial.jenis_kelamin) ormData.jenis_kelamin = partial.jenis_kelamin;
    if (partial.tempat_lahir) ormData.tempat_lahir = partial.tempat_lahir;
    if (partial.tanggal_lahir) ormData.tanggal_lahir = partial.tanggal_lahir;
    if (partial.enable_edit) ormData.enable_edit = partial.enable_edit;
    if (partial.points) ormData.points = partial.points;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at) ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<ClientInternal | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByMarketingId(marketingId: number): Promise<ClientInternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { marketing: { id: marketingId } },
    });
    return ormEntities.map(this.toDomain);
  }

  async findByKtp(noKtp: string): Promise<ClientInternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { no_ktp: noKtp },
    });

    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async save(client_internal: ClientInternal): Promise<ClientInternal> {
    const savedOrm = await this.ormRepository.save(client_internal);
    return savedOrm; // langsung, karena domain == orm
  }

  async update(
    id: number,
    client_internalData: Partial<ClientInternal>,
  ): Promise<ClientInternal> {
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

  async findAll(): Promise<ClientInternal[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }
}
