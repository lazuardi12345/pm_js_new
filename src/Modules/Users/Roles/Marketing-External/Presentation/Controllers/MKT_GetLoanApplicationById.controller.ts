// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { MKT_GetLoanApplicationByIdUseCase } from '../../Applications/Services/MKT_GetLoanApplicationById.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { LoanType } from 'src/Shared/Enums/External/Loan-Application.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
@Controller('mkt/ext/loan-apps')
export class MKT_GetLoanApplicationByIdController {
  constructor(
    @Inject(MKT_GetLoanApplicationByIdUseCase)
    private readonly getLoanAppByIdUseCase: MKT_GetLoanApplicationByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.MARKETING)
  // @Public()
  @Get('detail/:id')
  async getLoanApplicationById(@Param('id') id: number) {
    try {
      const payload = await this.getLoanAppByIdUseCase.execute(id);

      return {
        payload,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
