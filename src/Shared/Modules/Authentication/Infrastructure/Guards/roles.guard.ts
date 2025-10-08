import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<USERTYPE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException(
        'Masalah dengan autentikasi, silahkan login kembali',
      );
    }

    const hasRole = requiredRoles.some(
      (role) => user.usertype.toUpperCase() === role.toUpperCase(),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Akses ditolak, Endpoint ini memerlukan: [${requiredRoles.join(', ')}]. Role anda: ${user.usertype}`,
      );
    }

    return true;
  }
}
