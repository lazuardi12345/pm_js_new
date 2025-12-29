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
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { HM_GetAllApprovalHistoryExternalUseCase } from '../../../Application/Services/External/HM_GetApprovalHistory.usecase';

@Controller('hm/ext/loan-apps')
export class HM_GetApprovalHistoryExternalController {
  constructor(
    private readonly getApprovalHistoryByTeamUseCase: HM_GetAllApprovalHistoryExternalUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get('history')
  async getHistory(
    @CurrentUser('id') hmId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
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
      console.error('[HM_GetApprovalHistoryController] Error:', err);
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
