import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { HM_GetAllUsers_UseCase } from '../../Application/Services/HM_GetAllUsers.usecase';

@Controller('hm/int/loan-apps/users')
export class HM_GetAllUsers_Controller {
  private readonly logger = new Logger(HM_GetAllUsers_Controller.name);

  constructor(
    @Inject(HM_GetAllUsers_UseCase)
    private readonly getAllUsersUseCase: HM_GetAllUsers_UseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get()
  async getAllUsers(
    @Query('page') pageQuery?: string,
    @Query('pageSize') pageSizeQuery?: string,
  ) {
    const page = Number(pageQuery) > 0 ? Number(pageQuery) : 1;
    const pageSize = Number(pageSizeQuery) > 0 ? Number(pageSizeQuery) : 10;

    this.logger.log(`Fetching users | Page: ${page}, PageSize: ${pageSize}`);

    try {
      const result = await this.getAllUsersUseCase.execute(page, pageSize);

      return {
        success: true,
        data: result.data,
        page,
        pageSize,
        total: result.total,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      this.logger.error(`Failed to fetch users: ${message}`);

      throw new HttpException(
        {
          success: false,
          error: 'Gagal mengambil data user',
          message,
          reference: 'HM_USERS_FETCH_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
