import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { HM_GetAllUsers_UseCase } from '../../Application/Services/HM_GetAllUsers.usecase';

@Controller('hm/int/loan-apps/users')
export class HM_GetAllUsers_Controller {
  constructor(
    @Inject(HM_GetAllUsers_UseCase)
    private readonly getAllUsersUseCase: HM_GetAllUsers_UseCase,
  ) {
    console.log('HM_GetAllUsers_Controller instantiated');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get()
  async getAllUsers(
    @Query('page') pageQuery?: string,
    @Query('pageSize') pageSizeQuery?: string,
  ) {
    console.log('getAllUsers called with', { pageQuery, pageSizeQuery });
    const page = Number(pageQuery) > 0 ? Number(pageQuery) : 1;
    const pageSize = Number(pageSizeQuery) > 0 ? Number(pageSizeQuery) : 10;

    try {
      const result = await this.getAllUsersUseCase.execute(page, pageSize);
      console.log('UseCase result:', result);
      return {
        success: true,
        data: result.data,
        page,
        pageSize,
        total: result.total,
      };
    } catch (err) {
      console.error('Error in getAllUsers:', err);
      throw new HttpException(
        {
          payload: {
            error: 'Gagal mengambil data user',
            message: err instanceof Error ? err.message : 'Unexpected error',
            reference: 'HM_USERS_FETCH_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

