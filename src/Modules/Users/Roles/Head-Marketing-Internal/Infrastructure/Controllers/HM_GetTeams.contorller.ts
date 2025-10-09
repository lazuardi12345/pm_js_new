import { Controller, Get, UseGuards } from '@nestjs/common';
import { HM_GetTeamsUseCase } from '../../Application/Services/HM_GetTeams.Usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('hm/int')
export class HM_GetTeamsController {
  constructor(private readonly getTeams: HM_GetTeamsUseCase) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.HM)
  @Get('teams')
  async getByTeams(@CurrentUser('id') hm_id: number) {
    try {
      const payload = await this.getTeams.execute(hm_id);
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
