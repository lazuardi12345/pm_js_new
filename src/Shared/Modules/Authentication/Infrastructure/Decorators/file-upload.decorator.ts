// file-upload-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../Decorators/public.decorator';

@Injectable()
export class FileUploadAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];

    // Untuk multipart, bypass body parsing
    if (contentType?.includes('multipart/form-data')) {
      console.log(
        '🔐 FileUploadAuthGuard: Multipart request detected, using header-only auth',
      );
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }

    // Jangan touch request body untuk multipart
    if (contentType?.includes('multipart/form-data')) {
      console.log(
        '✅ FileUploadAuthGuard: Auth success, preserving multipart stream',
      );
    }

    return user;
  }
}
