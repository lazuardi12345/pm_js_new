import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class SVY_GetAllSurveyHistoryUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(page: number, pageSize: number) {
    try {
      const offset = (page - 1) * pageSize;

      const result =
        await this.loanAppRepo.callSP_SVY_GetAllSurveyHistory_External(
          page,
          pageSize,
        );

      const { data, total } = result;

      const formattedData = data.map((item: any, index: number) => ({
        no: offset + index + 1,
        berjumpa_siapa: item.berjumpa_siapa ?? '-',
        hubungan: item.hubungan ?? '-',
        status_rumah: item.status_rumah ?? '-',
        hasil_cekling1: item.hasil_cekling1 ?? '-',
        hasil_cekling2: item.hasil_cekling2 ?? '-',
        kesimpulan: item.kesimpulan ?? '-',
        rekomendasi: item.rekomendasi ?? '-',
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      return {
        payload: {
          success: true,
          message: 'Survey reports rendered successfully',
          reference: 'SVY_SURVEY_REPORTS_OK',
          data: { result: formattedData },
          page,
          pageSize,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch survey reports',
          message: error?.message ?? 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
