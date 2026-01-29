import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { Inject } from '@nestjs/common';
import { IUserForAuthRepository } from '../../Domain/Repositories/UserForAuth.repository';
import {
  IPasswordHasher,
  PASSWORD_HASHER,
} from '../../Domain/Service/HashPassword.service';
import { USERS_REPOSITORY } from 'src/Modules/Users/Domain/Repositories/users.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly userRepo: IUserForAuthRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log('Email:', email);
    console.log('Password:', password);

    const user = await this.userRepo.findByEmail(email);
    console.log('User from DB:', user);

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.passwordHash)
      throw new UnauthorizedException('Password hash missing');

    const ok = await this.passwordHasher.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      usertype: user.usertype,
      type: user.type,
      spvId: user.spvId,
      is_active: user.isActive,
    };
  }
}
