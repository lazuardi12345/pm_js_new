// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SPV_GetAllApproval_ByTeam_UseCase } from '../../Applications/Services/SPV_GetApprovalHistoryByTeam.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('spv/int/loan-apps')
export class SPV_GetAllApprovalHistory_Controller {
  constructor(
    @Inject(SPV_GetAllApproval_ByTeam_UseCase)
    private readonly getAllApproval_ByTeam_Repo: SPV_GetAllApproval_ByTeam_UseCase,
  ) {}

  // @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.SPV)
  @Get('/history')
  async getAllLoanApplications(
    @CurrentUser('id') supervisorId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      console.log('spv', supervisorId, page, pageSize);
      const result = await this.getAllApproval_ByTeam_Repo.execute(
        supervisorId,
        page,
        pageSize,
        searchQuery,
      );
      return {
        payload: {
          error: false,
          message: 'Get Loan Application by ID was successfuly retrieved',
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
      console.log(err);
      throw new HttpException(
        {
          payload: {
            error: 'Unexpected error',
            message: 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
