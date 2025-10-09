// src/Modules/LoanAppInternal/Infrastructure/Controllers/HM_GetApprovalHistoryByTeam.controller.ts

import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HM_GetAllApprovalHistoryUseCase } from '../../Application/Services/HM_GetApprovalHistory.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('hm/int/loan-apps/history')
export class HM_GetApprovalHistoryController {
  constructor(
    @Inject(HM_GetAllApprovalHistoryUseCase)
    private readonly getApprovalHistoryByTeamUseCase: HM_GetAllApprovalHistoryUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get()
  async getHistory(
    @CurrentUser('id') hmId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      console.log('💼 HM History Request:', hmId, page, pageSize);

      const result = await this.getApprovalHistoryByTeamUseCase.execute(
        hmId,
        page,
        pageSize,
        searchQuery,
      );

      return {
        payload: {
          error: false,
          message: 'HM approval history retrieved successfully',
          reference: 'HM_HISTORY_RETRIEVE_OK',
          data: {
            results: result.data,
            page,
            pageSize,
            total: result.total,
          },
        },
      };
    } catch (err) {
      console.error('❌ Error in HM_GetApprovalHistoryByTeamController:', err);
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err.message || 'Unexpected error',
            reference: 'HM_HISTORY_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
