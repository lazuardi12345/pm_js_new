// src/Modules/LoanAppInternal/Presentation/Controllers/HM_GetLoanApplicationById.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { HM_GetLoanApplicationByIdInternalUseCase } from '../../../Application/Services/Internal/HM_GetLoanApplicationById.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';

@Controller('hm/int/loan-apps')
export class HM_GetLoanApplicationByIdInternalController {
  constructor(
    @Inject(HM_GetLoanApplicationByIdInternalUseCase)
    private readonly getLoanAppByIdUseCase: HM_GetLoanApplicationByIdInternalUseCase,
  ) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(USERTYPE.HM)
  @Public()
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
