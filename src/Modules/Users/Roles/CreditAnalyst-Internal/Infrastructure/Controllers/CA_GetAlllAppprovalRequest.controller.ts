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
import { CA_GetAllApprovalRequest_UseCase } from '../../Applications/Services/CA_GetAllApprovalRequest.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('ca/int/loan-apps')
export class CA_GetAllApprovalRequest_Controller {
  constructor(
    @Inject(CA_GetAllApprovalRequest_UseCase)
    private readonly getAllApprovalRequest_Repo: CA_GetAllApprovalRequest_UseCase,
  ) {}

  // @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.CA)
  @Get('/request')
  async getAllLoanApplications(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      const result = await this.getAllApprovalRequest_Repo.execute(
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
