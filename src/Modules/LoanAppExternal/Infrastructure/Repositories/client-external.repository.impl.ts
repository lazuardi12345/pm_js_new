import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientExternal } from '../../Domain/Entities/client-external.entity';
import { IClientExternalRepository } from '../../Domain/Repositories/client-external.repository';
import { ClientExternal_ORM_Entity } from '../Entities/client-external.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';

@Injectable()
export class ClientExternalRepositoryImpl implements IClientExternalRepository {
  constructor(
    @InjectRepository(ClientExternal_ORM_Entity)
    private readonly ormRepository: Repository<ClientExternal_ORM_Entity>,
  ) {}

  //? MAPPER >==========================================================================

  private toDomain(orm: ClientExternal_ORM_Entity): ClientExternal {
    return new ClientExternal(
      orm.marketing,
      orm.nama_lengkap,
      orm.nik,
      orm.no_kk,
      orm.tempat_lahir,
      orm.tanggal_lahir,
      orm.id,
      orm.points,
      orm.created_at ?? new Date(),
      orm.updated_at ?? new Date(),
      orm.deleted_at ?? null,
    );
  }

  private toOrmPartial(
    partial: Partial<ClientExternal>,
  ): Partial<ClientExternal_ORM_Entity> {
    const ormData: Partial<ClientExternal_ORM_Entity> = {};

    if (partial.marketing)
      ormData.marketing = { id: partial.marketing.id } as Users_ORM_Entity;

    if (partial.nama_lengkap) ormData.nama_lengkap = partial.nama_lengkap;
    if (partial.nik) ormData.nik = partial.nik;
    if (partial.no_kk) ormData.no_kk = partial.no_kk;
    if (partial.tempat_lahir) ormData.tempat_lahir = partial.tempat_lahir;
    if (partial.tanggal_lahir) ormData.tanggal_lahir = partial.tanggal_lahir;
    if (partial.created_at) ormData.created_at = partial.created_at;
    if (partial.updated_at) ormData.updated_at = partial.updated_at;
    if (partial.deleted_at !== undefined)
      ormData.deleted_at = partial.deleted_at;

    return ormData;
  }

  //?===================================================================================

  async findById(id: number): Promise<ClientExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { id },
      relations: ['marketing'],
    });

    return ormEntity ? this.toDomain(ormEntity) : null;
  }
  async findByKtp(noKtp: number): Promise<ClientExternal | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { nik: noKtp },
    });

    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByMarketingId(marketingId: number): Promise<ClientExternal[]> {
    const ormEntities = await this.ormRepository.find({
      where: { marketing: { id: marketingId } },
      relations: ['marketing'],
    });

    return ormEntities.map((orm) => this.toDomain(orm));
  }

  async findAll(): Promise<ClientExternal[]> {
    const ormEntities = await this.ormRepository.find({
      relations: ['marketing'],
    });
    return ormEntities.map((orm) => this.toDomain(orm));
  }

  async save(client_external: ClientExternal): Promise<ClientExternal> {
    const ormData = this.toOrmPartial(client_external);
    const saved = await this.ormRepository.save(ormData);
    return this.toDomain(saved);
  }

  async update(
    id: number,
    client_externalData: Partial<ClientExternal>,
  ): Promise<ClientExternal> {
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
