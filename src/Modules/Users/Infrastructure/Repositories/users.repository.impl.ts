import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { UsersEntity } from '../../Domain/Entities/users.entity';
import { IUsersRepository } from '../../Domain/Repositories/users.repository';
import { Users_ORM_Entity } from '../Entities/users.orm-entity';

@Injectable()
export class UsersRepositoryImpl implements IUsersRepository {
  connection: any;
  constructor(
    @InjectRepository(Users_ORM_Entity)
    private readonly ormRepository: Repository<Users_ORM_Entity>,
     private readonly dataSource: DataSource,
  ) {}

  // =================================================================
  // MAPPERS
  // =================================================================

  private toDomain(orm: Users_ORM_Entity): UsersEntity {
    return new UsersEntity(
      orm.nama,
      orm.email,
      orm.password,
      orm.usertype,
      orm.type,
      orm.marketing_code,
      orm.spv_id,
      orm.is_active,
      orm.id,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
    );
  }

  private toOrm(domain: UsersEntity): Partial<Users_ORM_Entity> {
    return {
      id: domain.id,
      nama: domain.nama,
      email: domain.email,
      password: domain.getPassword(),
      usertype: domain.usertype,
      type: domain.type,
      marketing_code: domain.marketingCode,
      spv_id: domain.spvId || null,
      is_active: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
    };
  }

  private toOrmPartial(partial: Partial<UsersEntity>): Partial<Users_ORM_Entity> {
    const ormData: Partial<Users_ORM_Entity> = {};
    if (partial.nama) ormData.nama = partial.nama;
    if (partial.email) ormData.email = partial.email;
    if (partial['password']) ormData.password = partial['password']; // karena password private di entity
    if (partial.usertype) {
      ormData.usertype = partial.usertype;
    }
    if (partial.type) ormData.type = partial.type;
    if (partial.marketingCode) ormData.marketing_code = partial.marketingCode;
    if (partial.spvId) ormData.spv_id = partial.spvId;
    if (partial.isActive) ormData.is_active = partial.isActive;
    if (partial.createdAt) ormData.createdAt = partial.createdAt;
    if (partial.updatedAt) ormData.updatedAt = partial.updatedAt;
    if (partial.deletedAt) ormData.deletedAt = partial.deletedAt;
    return ormData;
  }

  // =================================================================
  // CRUD METHODS
  // =================================================================

  async findById(id: number): Promise<UsersEntity | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { email } });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<UsersEntity[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map((orm) => this.toDomain(orm));
  }

  async save(user: UsersEntity): Promise<UsersEntity> {
    const ormEntity = this.toOrm(user);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async update(
    id: number,
    userData: Partial<UsersEntity>,
  ): Promise<UsersEntity> {
    await this.ormRepository.update(id, this.toOrmPartial(userData));
    const updated = await this.ormRepository.findOne({ where: { id } });
    if (!updated) throw new Error('User not found');
    return this.toDomain(updated);
  }

  async softDelete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }


   async callSP_HM_GetAllUsers(
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const result = await this.dataSource.query(`CALL HM_GetAllUsers(?, ?)`, [page, pageSize]);

    const total = result[0][0]?.total_count || 0;
    const data = result[1] || [];

    return { total, data };
  }
}

