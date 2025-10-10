import { Inject, Injectable } from '@nestjs/common';
import { TokenResponseDto } from '../DTOS/TokenResponse/TokenResponse.dto';
import { ITokenSign, TOKEN_SIGN } from '../../Domain/Service/TokenSign.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKEN_SIGN)
    private readonly tokenSign: ITokenSign,
  ) {}

  async execute(user: {
    id: number;
    nama: string;
    email: string;
    usertype: string;
    is_active: string;
  }): Promise<TokenResponseDto> {
    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      usertype: user.usertype,
      is_active: user.is_active,
    };
    const token = await this.tokenSign.sign(payload);

    return { accessToken: token, expiresIn: 3600 }; // 1 jam
  }
}
