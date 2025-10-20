// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { CA_GetDashboardStatsUseCase } from '../../Applications/Services/CA_GetDashboardStats.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
@Controller('ca/int/loan-apps')
export class CA_GetDashboardStatsController {
  constructor(
    @Inject(CA_GetDashboardStatsUseCase)
    private readonly getDashboardStatsUseCase: CA_GetDashboardStatsUseCase,
  ) {}

  // @UseGuards(RolesGuard)
  // @Roles(USERTYPE.CA)
  @Public()
  @Get('dashboard-stats')
  async getDashboardStats(@CurrentUser('id') creditAnalystId: number) {
    const id = 6;
    try {
      const payload = await this.getDashboardStatsUseCase.execute(id);
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
