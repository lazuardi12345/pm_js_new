import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenSign } from '../../Domain/Service/TokenSign.service';

@Injectable()
export class JwtTokenService implements ITokenSign{
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: any): Promise<string> {
    // jwtService.sign sync, but wrap as Promise for interface consistency
    return this.jwtService.sign(payload);
  }

  verify<T extends object = Record<string, any>>(token: string): T {
    return this.jwtService.verify<T>(token);
  }
}
