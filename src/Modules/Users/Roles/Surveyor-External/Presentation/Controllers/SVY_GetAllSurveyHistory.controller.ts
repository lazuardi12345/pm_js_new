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
import { SVY_GetAllSurveyHistoryUseCase } from '../../Applications/Services/SVY_GetAllSurveyHistory.usecase';

@Controller('svy/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class SVY_GetAllSurveyHistoryController {
  constructor(
    @Inject(SVY_GetAllSurveyHistoryUseCase)
    private readonly getSurveyHistory: SVY_GetAllSurveyHistoryUseCase,
  ) {}

  @Get('survey/history')
  async getSurveyList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
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
    return this.getSurveyHistory.execute(page, pageSize);
  }
}
