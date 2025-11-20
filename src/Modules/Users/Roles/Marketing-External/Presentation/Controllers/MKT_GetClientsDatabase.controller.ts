import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MKT_GetClientsDatabaseUseCase } from '../../Applications/Services/MKT_GetClientsDatabase.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Controller('mkt/int/loan-apps')
export class MKT_GetClientDatabaseController {
  constructor(
    @Inject(MKT_GetClientsDatabaseUseCase)
    private readonly getClientsDatabase: MKT_GetClientsDatabaseUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Get('clients')
  async getClientDatabase(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    try {
      const result = await this.getClientsDatabase.execute(page, pageSize);
      return result;
    } catch (err) {
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err instanceof Error ? err.message : 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
