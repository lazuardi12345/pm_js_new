// src/Modules/Admin/Users/Infrastructure/Controllers/AdCont_UserSearch.controller.ts
import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { AdCont_GetMarketingOrCreditAnalystUseCase } from '../Applications/Services/AdCont_GetMarketingOrCreditAnalystName.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@Controller('adcont/users')
export class AdCont_GetMarketingOrCreditAnalystController {
  constructor(
    private readonly getMarketingOrCreditAnalyst: AdCont_GetMarketingOrCreditAnalystUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUser(
    @Query('type') type: 'MARKETING' | 'CREDIT_ANALYST',
    @Query('name') name?: string,
  ) {
    const result = await this.getMarketingOrCreditAnalyst.execute(type, name);

    return {
      payload: result,
    };
  }
}
