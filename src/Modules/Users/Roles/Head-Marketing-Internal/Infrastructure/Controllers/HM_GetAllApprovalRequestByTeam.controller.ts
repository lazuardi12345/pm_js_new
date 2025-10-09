import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HM_GetAllApprovalRequestByTeam_UseCase } from '../../Application/Services/HM_GetAllApprovalRequestByTeam.Usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('hm/int/loan-apps')
export class HM_GetAllApprovalRequestByTeamController {
  constructor(
    @Inject(HM_GetAllApprovalRequestByTeam_UseCase)
    private readonly getAllApprovalRequest_ByTeam_Repo: HM_GetAllApprovalRequestByTeam_UseCase,
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
      console.log('hm', hmId, page, pageSize);
      const result = await this.getAllApprovalRequest_ByTeam_Repo.execute(
        hmId,
        page,
        pageSize,
        searchQuery,
      );

      return {
        payload: {
          error: false,
          message: 'Get Loan Application by Team successfully retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: {
            results: result.data,
            page,
            pageSize,
            total: result.total,
          },
        },
      };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err.message || 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
