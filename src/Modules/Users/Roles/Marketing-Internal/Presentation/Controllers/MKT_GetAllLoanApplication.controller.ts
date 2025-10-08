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
import { MKT_GetAllLoanApplicationUseCase } from '../../Applications/Services/MKT_GetAllLoanApplication.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('mkt/int/loan-apps')
export class MKT_GetAllLoanApplicationController {
  constructor(
    @Inject(MKT_GetAllLoanApplicationUseCase)
    private readonly getAllLoanAppUseCase: MKT_GetAllLoanApplicationUseCase,
  ) {}

  // @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Get()
  async getAllLoanApplications(
    @CurrentUser('id') marketingId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchQuery') searchQuery = '',
  ) {
    try {
      const result = await this.getAllLoanAppUseCase.execute(
        marketingId,
        page,
        pageSize,
        searchQuery,
      );
      return {
        success: true,
        data: result.data,
        page,
        pageSize,
        total: result.total,
      };
    } catch (err) {
      throw new HttpException(
        {
          payload: {
            error: "Unexpected error",
            message: "Unexpected error",
            reference: "LOAN_UNKNOWN_ERROR",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
