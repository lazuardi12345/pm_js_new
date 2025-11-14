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
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { MKT_GetAllRepeatOrderHistoryUseCase } from '../../Applications/Services/MKT_GetAllRepeatOrderHistory.usecase';

@Controller('mkt/int/loan-apps')
export class MKT_GetAllRepeatOrderHistoryController {
  constructor(
    @Inject(MKT_GetAllRepeatOrderHistoryUseCase)
    private readonly getAllRepeatOrderHistoryRepo: MKT_GetAllRepeatOrderHistoryUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Get('history/repeat-order')
  async getAllRepeatOrderHistory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @CurrentUser('id') marketingId: number,
  ) {
    try {
      const result = await this.getAllRepeatOrderHistoryRepo.execute(
        marketingId,
        page,
        pageSize,
      );
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
