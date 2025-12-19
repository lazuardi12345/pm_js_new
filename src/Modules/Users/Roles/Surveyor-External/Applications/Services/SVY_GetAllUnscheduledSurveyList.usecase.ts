import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { SurveyListItem } from 'src/Shared/Interface/SVY_SurveyList/SurveyList.interface';

@Injectable()
export class SVY_GetAllUnscheduledSurveyListUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(page: number, pageSize: number) {
    try {
      const offset = (page - 1) * pageSize;

      const result =
        await this.loanAppRepo.callSP_SVY_GetAllUnscheduledSurveyList_External(
          page,
          pageSize,
        );

      const { data, total } = result;
      const formattedData: SurveyListItem[] = data.map(
        (item: any, index: number) => ({
          no: offset + index + 1,
          nama_nasabah: item.nama_nasabah ?? '-',
          nominal_pinjaman: item.nominal_pinjaman,
          tenor: item.tenor ? `${item.tenor} Bulan` : '-',
          marketing: item.marketing ?? '-',
          tanggal_pengajuan: item.created_at,
          pembiayaan: item.jenis_pembiayaan ?? '-',
          pengajuan_id: Number(item.id),
          nasabah_id: item.nasabah_id,
        }),
      );

      return {
        payload: {
          success: true,
          message: `Survey List rendered successfully`,
          reference: 'SVY_SURVEY_LIST_OK',
          data: { result: formattedData },
          total,
          page,
          pageSize,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch survey list',
          message: error?.message ?? 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
