import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';

@Injectable()
export class CA_TriggerSurvey_UseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(loan_id: number, needSurvey: boolean) {
    try {
      const newUpdateStatusPengajuan = needSurvey
        ? StatusPengajuanEnum.PERLU_SURVEY
        : StatusPengajuanEnum.TIDAK_PERLU_SURVEY;
      const res = await this.loanAppRepo.update(loan_id, {
        status_pengajuan: newUpdateStatusPengajuan,
      });

      if (!res) {
        return {
          payload: {
            success: false,
            message: `Cant set Survey Schedule properly`,
            reference: 'CA_SET_SURVEY_SCHEDULE_ERROR',
          },
        };
      }

      return {
        payload: {
          success: true,
          message: `Survey Schedule was set Successfully`,
          reference: 'CA_SET_SURVEY_SCHEDULE_OK',
        },
      };
    } catch (err) {
      throw new Error(err.message || 'Gagal update jadwal survey');
    }
  }
}
