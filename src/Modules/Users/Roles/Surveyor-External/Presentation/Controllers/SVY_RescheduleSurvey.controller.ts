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
import { SVY_RescheduleSurvey_UseCase } from '../../Applications/Services/SVY_RescheduleSurvey.usecase';

@Controller('svy/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class SVY_RescheduleSurveyController {
  constructor(
    @Inject(SVY_RescheduleSurvey_UseCase)
    private readonly updateSurveyScheduleUseCase: SVY_RescheduleSurvey_UseCase,
  ) {}

  @Patch('reschedule/:loan_id')
  async rescheduleSurvey(
    @Param('loan_id') loan_id: number,
    @Body('schedule_time') schedule_time: string,
  ) {
    if (!loan_id || !schedule_time) {
      throw new BadRequestException('loan_id dan schedule_time wajib diisi');
    }

    const parsedDate = new Date(schedule_time);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Format schedule_time tidak valid');
    }

    return this.updateSurveyScheduleUseCase.execute(loan_id, parsedDate);
  }
}
