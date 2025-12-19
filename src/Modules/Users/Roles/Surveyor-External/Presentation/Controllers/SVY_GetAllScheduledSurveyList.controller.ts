// src/Modules/LoanAppExternal/Presentation/Controllers/svy-survey.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SVY_GetAllScheduledSurveyListUseCase } from '../../Applications/Services/SVY_GetAllScheduledSurveyList.usecase';

@Controller('svy/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class SVY_GetAllScheduledSurveyListController {
  constructor(
    @Inject(SVY_GetAllScheduledSurveyListUseCase)
    private readonly getSurveyListUseCase: SVY_GetAllScheduledSurveyListUseCase,
  ) {}

  @Get('survey-list/scheduled')
  async getSurveyList(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    if (
      !Number.isInteger(parsedPage) ||
      !Number.isInteger(parsedPageSize) ||
      parsedPage < 1 ||
      parsedPageSize < 1 ||
      parsedPageSize > 100
    ) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.getSurveyListUseCase.execute(parsedPage, parsedPageSize);
  }
}
