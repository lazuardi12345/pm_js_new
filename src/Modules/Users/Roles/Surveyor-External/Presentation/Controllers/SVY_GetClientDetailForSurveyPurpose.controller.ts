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
import { SVY_GetClientDetailForSurveyPurposeUseCase } from '../../Applications/Services/SVY_GetClientDetailForSurveyPurpose.usecase';

@Controller('svy/ext/loan-apps')
@UseGuards(RolesGuard)
@Roles(USERTYPE.SVY)
export class SVY_GetClientDetailForSurveyPurposeController {
  constructor(
    @Inject(SVY_GetClientDetailForSurveyPurposeUseCase)
    private readonly getSurveyListUseCase: SVY_GetClientDetailForSurveyPurposeUseCase,
  ) {}

  @Get('survey-list/client-details/:loan_app_id')
  async getSurveyList(@Param('loan_app_id') loan_app_id: number) {
    if (!loan_app_id) {
      throw new BadRequestException('loan_app_id is required');
    } else if (isNaN(loan_app_id)) {
      throw new BadRequestException('loan_app_id must be a number');
    }

    const res = await this.getSurveyListUseCase.execute(loan_app_id);

    return {
      payload: {
        success: true,
        message: `Client Details for survey purpose was rendered successfully`,
        reference: 'SVY_CLIENT_DETAILS_SURVEY_OK',
        data: res,
      },
    };
  }
}
