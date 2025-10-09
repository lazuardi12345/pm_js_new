import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { HM_GetAllApprovalRequestUseCase } from '../../Application/Services/HM_GetAllApprovalRequest.Usecase';

@Controller('hm/int/loan-apps')
export class HM_GetAllApprovalRequestController {
  constructor(
    private readonly getAllApprovalRequestByTeamUseCase: HM_GetAllApprovalRequestUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get('/request')
  async getAllLoanApplications(
    @CurrentUser('id') hmId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      const result = await this.getAllApprovalRequestByTeamUseCase.execute(
        hmId,
        page,
        pageSize,
        searchQuery,
      );

      return {
        payload: {
          error: false,
          message: 'HM loan approval requests retrieved successfully',
          reference: 'HM_LOAN_RETRIEVE_OK',
          data: {
            results: result.data,
            page,
            pageSize,
            total: result.total,
          },
        },
      };
    } catch (err) {
      console.error('❌ Controller error:', err);
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err.message || 'Unexpected error',
            reference: 'HM_LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
