import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class SVY_RescheduleSurvey_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(loan_id: number, schedule_time: Date) {
    try {
      const res = await this.loanAppRepo.update(loan_id, {
        survey_schedule: schedule_time,
      });

      if (!res) {
        return {
          payload: {
            success: false,
            message: `Cant set Survey Schedule properly`,
            reference: 'SVY_SET_SURVEY_SCHEDULE_ERROR',
          },
        };
      }

      return {
        payload: {
          success: true,
          message: `Survey Schedule was set Successfully`,
          reference: 'SVY_SET_SURVEY_SCHEDULE_OK',
        },
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal update jadwal survey');
    }
  }
}
