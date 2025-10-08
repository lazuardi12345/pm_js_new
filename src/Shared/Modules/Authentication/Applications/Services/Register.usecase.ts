import { Inject, Injectable } from '@nestjs/common';
import { IPasswordHasher, PASSWORD_HASHER } from '../../Domain/Service/HashPassword.service';
import { IUsersRepository, USERS_REPOSITORY } from 'src/Modules/Users/Domain/Repositories/users.repository';
import { TYPE, USERSTATUS, USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { UsersEntity } from 'src/Modules/Users/Domain/Entities/users.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: IUsersRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: {
    nama: string;
    email: string;
    password: string;
    usertype: USERTYPE;
    type: TYPE;
    marketingCode: string;
    spvId?: number | null;
    isActive: boolean;
  }) {
    const pwHash = await this.passwordHasher.hash(dto.password);

    const userEntity = new UsersEntity(
      dto.nama, // harus ada nama sesuai constructor
      dto.email,
      pwHash,
      dto.usertype,
      dto.type,
      dto.marketingCode,
      dto.spvId,
      USERSTATUS.ACTIVE,
    );

    const user = await this.usersRepo.save(userEntity);

    return { message: 'User registered successfully', userId: user.id };
  }
}
