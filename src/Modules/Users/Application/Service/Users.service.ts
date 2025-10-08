import { Injectable, Inject } from '@nestjs/common';
import { UsersEntity } from '../../Domain/Entities/users.entity';
import { CreateUserDto } from '../DTOS/create-user.dto';
import { UpdateUserDto } from '../DTOS/update-user.dto';
import { IUsersRepository, USERS_REPOSITORY } from '../../Domain/Repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly repo: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UsersEntity> {
    const now = new Date();

    const address = new UsersEntity(
      dto.nama,
      dto.email,
      dto.password,
      dto.usertype,
      dto.type,
      dto.marketing_code,
      dto.spvId,
      dto.is_active,
      undefined,
      now,
      now,
      null,
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UsersEntity> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<UsersEntity | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.repo.findAll();
  }

  async softDelete(id: number): Promise<void> {
    return this.repo.softDelete(id);
  }
}
