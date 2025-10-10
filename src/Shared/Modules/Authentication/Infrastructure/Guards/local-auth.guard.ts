// local-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    if (err || !user) {
      // info.message berasal dari strategy (Invalid credentials / User not found)
      console.log("info: ", info)
      throw err || new UnauthorizedException(info?.message || 'Invalid credentials');
    }
    return user;
  }
}
