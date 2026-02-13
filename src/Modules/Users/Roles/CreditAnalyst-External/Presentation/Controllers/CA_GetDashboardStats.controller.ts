// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import {
  Controller,
  Get,
  Inject,
  UseGuards,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CA_GetDashboardStatsUseCase } from '../../Applications/Services/CA_GetDashboardStats.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
@Controller('ca/ext/loan-apps')
export class CA_GetDashboardStatsController {
  constructor(
    @Inject(CA_GetDashboardStatsUseCase)
    private readonly getDashboardStatsUseCase: CA_GetDashboardStatsUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.CA)
  // @Public()
  @Get('dashboard-stats')
  async getDashboardStats(
    @CurrentUser('id') creditAnalystId: number,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
    @Query('week', new ParseIntPipe({ optional: true })) week?: number,
  ) {
    try {
      console.log(creditAnalystId, year, month, week);
      const external = 'external';
      const payload = await this.getDashboardStatsUseCase.execute(
        creditAnalystId,
        external,
        year,
        month,
        week,
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
