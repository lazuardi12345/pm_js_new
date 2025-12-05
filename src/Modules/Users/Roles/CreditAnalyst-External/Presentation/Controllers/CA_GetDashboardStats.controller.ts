// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { CA_GetDashboardStatsUseCase } from '../../Applications/Services/CA_GetDashboardStats.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
@Controller('ca/ext/loan-apps')
export class CA_GetDashboardStatsController {
  constructor(
    @Inject(CA_GetDashboardStatsUseCase)
    private readonly getDashboardStatsUseCase: CA_GetDashboardStatsUseCase,
  ) {}
  @Public()
  @Get('dashboard-stats')
  async getDashboardStats(@CurrentUser('id') creditAnalystId: number) {
    try {
      const payload =
        await this.getDashboardStatsUseCase.execute(creditAnalystId);
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
