// src/Modules/LoanAppExternal/Presentation/Controllers/svy-survey.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Inject,
  Param,
} from '@nestjs/common';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SVY_GetSurveyHistoryByLoanAppIdExtUseCase } from '../../Applications/Services/SVY_GetSurveyHistoryByLoanAppIdExt.usecase';

@Controller('svy/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class SVY_GetSurveyHistoryByLoanAppIdExtController {
  constructor(
    @Inject(SVY_GetSurveyHistoryByLoanAppIdExtUseCase)
    private readonly getSurveyHistory: SVY_GetSurveyHistoryByLoanAppIdExtUseCase,
  ) {}

  @Get('survey/history/:pengajuan_luar_id')
  async getSurveyList(@Param('pengajuan_luar_id') pengajuan_luar_id: number) {
    return this.getSurveyHistory.execute(pengajuan_luar_id);
  }
}
