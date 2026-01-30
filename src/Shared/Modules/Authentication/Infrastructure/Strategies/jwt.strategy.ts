import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../../Applications/DTOS/PayloadJWT/JWTPayload.dto';
import {
  IUserForAuthRepository,
  USER_FOR_AUTH_REPOSITORY,
} from '../../Domain/Repositories/UserForAuth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_FOR_AUTH_REPOSITORY)
    private readonly userForAuthRepo: IUserForAuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'superSecretKey',
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayloadDto) {
    console.log(payload);
    if (!payload.is_active) {
      throw new UnauthorizedException('User not active');
    }

    const user = await this.userForAuthRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

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
