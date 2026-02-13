// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { MKT_GetDashboardStatsUseCase } from '../../Applications/Services/MKT_GetDashboardStats.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
@Controller('mkt/ext/loan-apps')
export class MKT_GetDashboardStatsController {
  constructor(
    @Inject(MKT_GetDashboardStatsUseCase)
    private readonly getDashboardStatsUseCase: MKT_GetDashboardStatsUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.MARKETING)
  // @Public()
  @Get('dashboard-stats')
  async getDashboardStats(@CurrentUser('id') marketingId: number) {
    try {
      const external = 'external';
      const payload = await this.getDashboardStatsUseCase.execute(
        marketingId,
        external,
      );
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
