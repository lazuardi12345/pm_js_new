// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { SPV_GetDashboardStatsUseCase } from '../../Applications/Services/SPV_GetDashboardStats.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
@Controller('spv/ext/loan-apps')
export class SPV_GetDashboardStatsController {
  constructor(
    @Inject(SPV_GetDashboardStatsUseCase)
    private readonly getDashboardStatsUseCase: SPV_GetDashboardStatsUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.SPV)
  // @Public()
  @Get('dashboard-stats')
  async getDashboardStats(@CurrentUser('id') supervisorId: number) {
    try {
      const external = 'external';
      const payload = await this.getDashboardStatsUseCase.execute(
        supervisorId,
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
