import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SPV_GetTeamsUseCase } from '../../Applications/Services/SPV_GetTeams.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('spv/int')
export class SPV_GetTeamsController {
  constructor(private readonly getTeams: SPV_GetTeamsUseCase) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.SPV)
  @Get('teams')
  async getByTeams(@CurrentUser('id') spv_id: number) {
    try {
      const payload = await this.getTeams.execute(spv_id);
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
