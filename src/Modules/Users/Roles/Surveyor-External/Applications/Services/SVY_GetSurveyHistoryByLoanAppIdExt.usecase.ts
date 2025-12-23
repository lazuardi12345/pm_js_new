import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { error } from 'console';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class SVY_GetSurveyHistoryByLoanAppIdExtUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(loan_app_id: number) {
    try {
      const results =
        await this.loanAppRepo.callSP_SVY_GetSurveyHistoryByLoanAppId_External(
          loan_app_id,
        );

      return {
        payload: {
          error: false,
          message: `Survey List rendered successfully`,
          reference: 'SVY_SURVEY_LIST_OK',
          data: {
            result: {
              survey_reports: results.survey_report,
              survey_photos: results.survey_photos,
            },
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch survey detail',
          message: error?.message ?? 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
