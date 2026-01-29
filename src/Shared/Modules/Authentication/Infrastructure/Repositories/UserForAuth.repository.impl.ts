import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import {
  IUserForAuthRepository,
  USER_FOR_AUTH_REPOSITORY,
} from '../../Domain/Repositories/UserForAuth.repository';
import { UserForAuth } from '../../Domain/Entities/UserForAuth.entity';

@Injectable()
export class UserForAuthRepositoryImpl implements IUserForAuthRepository {
  constructor(
    @InjectRepository(Users_ORM_Entity)
    private readonly ormRepo: Repository<Users_ORM_Entity>,
  ) {}

  async findByEmail(email: string): Promise<UserForAuth | null> {
    const orm = await this.ormRepo.findOne({ where: { email } });
    return orm
      ? new UserForAuth(
          orm.id,
          orm.nama,
          orm.email,
          orm.password,
          orm.usertype,
          orm.type,
          orm.is_active,
          orm?.spv_id,
        )
      : null;
  }

  async findById(id: number): Promise<UserForAuth | null> {
    const orm = await this.ormRepo.findOne({ where: { id } });
    return orm
      ? new UserForAuth(
          orm.id,
          orm.nama,
          orm.email,
          orm.password,
          orm.usertype,
          orm.type,
          orm.is_active,
          orm?.spv_id,
        )
      : null;
  }
}
