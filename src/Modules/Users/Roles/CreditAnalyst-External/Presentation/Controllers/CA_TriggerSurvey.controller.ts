// src/Modules/LoanAppExternal/Presentation/Controllers/svy-update-survey-schedule.controller.ts
import {
  Controller,
  Patch,
  Body,
  UseGuards,
  BadRequestException,
  Inject,
  Param,
} from '@nestjs/common';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CA_TriggerSurvey_UseCase } from '../../Applications/Services/CA_TriggerSurvey.usecase';

@Controller('ca/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class CA_TriggerSurveyController {
  constructor(
    @Inject(CA_TriggerSurvey_UseCase)
    private readonly updateSurveyScheduleUseCase: CA_TriggerSurvey_UseCase,
  ) {}

  @Patch(':loan_id/set-survey-schedule')
  async updateSurveySchedule(
    @Param('loan_id') loan_id: number,
    @Body('need_survey') needSurvey: boolean,
  ) {
    if (!loan_id || !needSurvey) {
      throw new BadRequestException('loan_id dan needSurvey wajib diisi');
    }

    return this.updateSurveyScheduleUseCase.execute(loan_id, needSurvey);
  }
}
