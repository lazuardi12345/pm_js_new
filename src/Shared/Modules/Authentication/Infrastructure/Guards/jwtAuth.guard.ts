// jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../Decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('JwtAuthGuard: Route is public, skipping auth');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('🔐 JwtAuthGuard: Authenticating request');
    console.log('   - URL:', request.url);
    console.log('   - Method:', request.method);
    console.log('   - Content-Type:', request.headers['content-type']);
    console.log('   - Has Authorization:', !!request.headers.authorization);

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('🔐 JwtAuthGuard: handleRequest');
    console.log('   - Error:', err);
    console.log('   - User:', user);
    console.log('   - Info:', info);

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Token tidak valid atau telah kedaluwarsa')
      );
    }
    return user;
  }
}
