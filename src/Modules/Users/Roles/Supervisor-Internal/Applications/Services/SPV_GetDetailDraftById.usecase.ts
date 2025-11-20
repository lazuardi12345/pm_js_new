import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY,
  ILoanApplicationDraftRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/int/LoanAppInt.repository';

export class SPV_GetDetailDraftByIdUseCase {
  constructor(
    @Inject(CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftRepository,
  ) {}
  async renderDraftById(Id: string) {
    try {
      const loanApp = await this.loanAppDraftRepo.findById(Id);
      if (!loanApp) {
        throw new HttpException(
          {
            payload: {
              error: 'NOT FOUND',
              message: 'No draft loan applications found for this ID',
              reference: 'LOAN_NOT_FOUND',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        error: false,
        message: 'Draft loan applications retrieved',
        reference: 'LOAN_RETRIEVE_OK',
        data: {
          client_and_loan_detail: {
            ...loanApp,
          },
        },
      };
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          payload: {
            error: true,
            message: 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
