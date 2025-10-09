// roles.guard.ts
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

    if (!requiredRoles) {
      console.log('✅ RolesGuard: No roles required, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log('🔐 RolesGuard: Checking roles');
    console.log('   - Required roles:', requiredRoles);
    console.log('   - User:', user);

    if (!user) {
      console.log('❌ RolesGuard: No user in request');
      throw new UnauthorizedException(
        'Masalah dengan autentikasi, silahkan login kembali',
      );
    }

    const hasRole = requiredRoles.some(
      (role) => user.usertype.toUpperCase() === role.toUpperCase(),
    );

    console.log(
      hasRole
        ? `RolesGuard: User has required role (${user.usertype})`
        : `RolesGuard: User lacks required role (has: ${user.usertype}, needs: ${requiredRoles.join(', ')})`,
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Akses ditolak, Endpoint ini memerlukan: [${requiredRoles.join(', ')}]. Role anda: ${user.usertype}`,
      );
    }

    return true;
  }
}
