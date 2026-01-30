import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';

@Injectable()
export class MKT_GetNextLoanSequenceUseCase {
  constructor(
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftExternalRepository,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppExternalRepo: ILoanApplicationExternalRepository,
  ) {}

  async getNextDraftsPinjamanKe(nik: string) {
    try {
      const nextPinjamanKe =
        await this.loanAppDraftRepo.getNextDraftPinjamanKeByNik(nik);

      return {
        payload: {
          error: false,
          message: 'Next loan sequence generated',
          reference: 'LOAN_SEQUENCE_OK',
          data: {
            nik,
            pinjaman_ke: nextPinjamanKe,
          },
        },
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          error: true,
          message: err.message || 'Failed to generate loan sequence',
          reference: 'LOAN_SEQUENCE_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNextLoanAppsPinjamanKe(nik: string) {
    try {
      const nextPinjamanKe =
        await this.loanAppExternalRepo.getNextLoanAppsPinjamanKeByNik(nik);

      return {
        payload: {
          error: false,
          message: 'Next loan sequence generated',
          reference: 'LOAN_SEQUENCE_OK',
          data: {
            nik,
            pinjaman_ke: nextPinjamanKe,
          },
        },
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          error: true,
          message: err.message || 'Failed to generate loan sequence',
          reference: 'LOAN_SEQUENCE_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
