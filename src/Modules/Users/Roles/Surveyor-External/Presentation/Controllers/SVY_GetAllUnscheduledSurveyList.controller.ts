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
import { SVY_GetAllUnscheduledSurveyListUseCase } from '../../Applications/Services/SVY_GetAllUnscheduledSurveyList.usecase';

@Controller('svy/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class SVY_GetAllUnscheduledSurveyListController {
  constructor(
    @Inject(SVY_GetAllUnscheduledSurveyListUseCase)
    private readonly getSurveyListUseCase: SVY_GetAllUnscheduledSurveyListUseCase,
  ) {}

  @Get('survey-list/unscheduled')
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
