// src/Modules/Users/Roles/Head-Marketing-Internal/Infrastructure/Controllers/HM_GetAllApprovalRequest.controller.ts

import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { HM_GetAllApprovalRequestInternalUseCase } from '../../../Application/Services/Internal/HM_GetAllApprovalRequest.Usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('hm/int/loan-apps/request')
export class HM_GetAllApprovalRequestInternalController {
  constructor(
    private readonly getAllApprovalRequestUseCase: HM_GetAllApprovalRequestInternalUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get()
  async getAllRequests(
    @CurrentUser('id') hmId: number,
    @Query('page') pageStr: string = '1',
    @Query('pageSize') pageSizeStr: string = '10',
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      // Convert query params ke number
      const page = parseInt(pageStr, 10) || 1;
      const pageSize = parseInt(pageSizeStr, 10) || 10;

      const result = await this.getAllApprovalRequestUseCase.execute(
        hmId,
        page,
        pageSize,
        searchQuery,
      );

      return {
        payload: {
          error: false,
          message: 'HM approval requests retrieved successfully',
          reference: 'HM_APPROVAL_REQUEST_RETRIEVE_OK',
          data: {
            results: result.data,
            page,
            pageSize,
            total: result.total,
          },
        },
      };
    } catch (err) {
      console.error('[HM_GetAllApprovalRequestController] Error:', err);
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err.message || 'Unexpected error',
            reference: 'HM_APPROVAL_REQUEST_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
