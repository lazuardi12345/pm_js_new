import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SPV_GetDetailDraftByIdUseCase } from '../../Applications/Services/SPV_GetDetailDraftById.usecase';

@Controller('spv/ext/loan-apps')
export class SPV_GetDetailDraftByIdController {
  constructor(
    private readonly getDetailDraftById: SPV_GetDetailDraftByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.SPV)
  @Get('teams/drafts/:draft_id')
  async getByTeams(@Param('draft_id') draft_id: string) {
    try {
      const payload = await this.getDetailDraftById.renderDraftById(draft_id);
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
