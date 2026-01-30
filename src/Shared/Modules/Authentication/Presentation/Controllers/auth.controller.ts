import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';

import { LocalAuthGuard } from '../../Infrastructure/Guards/local-auth.guard';
import { Public } from '../../Infrastructure/Decorators/public.decorator';
import { TYPE, USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { RegisterUseCase } from '../../Applications/Services/Register.usecase';
import { LoginUseCase } from '../../Applications/Services/Login.usecase';
import { Response } from 'express';
import { Roles } from '../../Infrastructure/Decorators/roles.decorator';
import { JwtAuthGuard } from '../../Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from '../../Infrastructure/Guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly LoginUseCase: LoginUseCase, //
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  // Guest: Register
  // @Roles(USERTYPE.SUPERADMIN)
  @Public()
  @Post('register')
  async register(
    @Body()
    dto: {
      nama: string;
      email: string;
      password: string;
      usertype: USERTYPE;
      type: TYPE;
      marketingCode: string;
      spvId?: number | null;
      isActive: boolean;
    },
  ): Promise<any> {
    return this.registerUseCase.execute(dto);
  }

  // Guest: Login
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const tokenDto = await this.LoginUseCase.execute(req.user);
    console.log(req);
    console.log('ini user: ', req.user);
    console.log('token', tokenDto);

    // res.cookie('access_token', tokenDto.accessToken, {
    //   domain: '.ngrok-free.app',
    //   path: '/',
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: 1000 * 60 * 60,
    // });

    return {
      payload: {
        error: false,
        message: 'Login success',
        reference: 'LOGIN_OK',
        data: {
          nama: req.user.nama,
          email: req.user.email,
          role: req.user.usertype,
          type: req.user.type,
          spvId: req.user.spvId,
          access_token: tokenDto.accessToken,
        },
      },
      // role: req.user, role};
    };
  }

  // User: hanya yang punya role 'user' atau 'admin'
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    USERTYPE.MARKETING,
    USERTYPE.SPV,
    USERTYPE.CA,
    USERTYPE.HM,
    USERTYPE.SUPERADMIN,
    USERTYPE.ADMIN_BI,
    USERTYPE.ADMIN_KONTRAK,
    USERTYPE.SVY,
  )
  @Get('me')
  async getProfile(@Req() req) {
    return {
      payload: {
        error: false,
        message: 'Get profile success',
        reference: 'GET_PROFILE_OK',
        data: {
          nama: req.user.nama,
          email: req.user.email,
          role: req.user.usertype,
          type: req.user.type,
        },
      },
    };
  }

  // // Admin only
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(USERTYPE.SUPERADMIN)
  // @Get('superadmin')
  // async getAdminData() {
  //   return { message: 'Halo Admin, data rahasia aman nih 🔐' };
  // }
}
