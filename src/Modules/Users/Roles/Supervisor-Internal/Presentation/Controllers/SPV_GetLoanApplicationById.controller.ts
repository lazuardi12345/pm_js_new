// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { SPV_GetLoanApplicationByIdUseCase } from '../../Applications/Services/SPV_GetLoanApplicationById.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
@Controller('spv/int/loan-apps')
export class SPV_GetLoanApplicationByIdController {
  constructor(
    @Inject(SPV_GetLoanApplicationByIdUseCase)
    private readonly getLoanAppByIdUseCase: SPV_GetLoanApplicationByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.SPV)
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
