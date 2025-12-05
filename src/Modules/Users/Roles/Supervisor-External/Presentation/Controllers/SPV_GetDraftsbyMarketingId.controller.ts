import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SPV_GetDraftByMarketingIdUseCase } from '../../Applications/Services/SPV_GetDraftsbyMarketingId.usecase';

@Controller('spv/ext/loan-apps')
export class SPV_GetDraftByMarketingIdController {
  constructor(
    private readonly getDraftByMarketingId: SPV_GetDraftByMarketingIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.SPV)
  @Get('teams/:marketingId/drafts')
  async getByTeams(@Param('marketingId') marketingId: number) {
    try {
      const payload = await this.getDraftByMarketingId.execute(marketingId);
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
