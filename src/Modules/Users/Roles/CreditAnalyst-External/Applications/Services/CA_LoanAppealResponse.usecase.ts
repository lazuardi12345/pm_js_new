import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ApprovalExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/approval-external.entity';
import {
  APPROVAL_EXTERNAL_REPOSITORY,
  IApprovalExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/approval-external.repository';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

export class CA_LoanAppealResponseUseCase {
  constructor(
    @Inject(APPROVAL_EXTERNAL_REPOSITORY)
    private readonly approvalExternalRepo: IApprovalExternalRepository,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanApplicationExternalRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(
    creditAnalystId: number,
    loan_id: number,
    appeal_response:
      | ApprovalExternalStatus.APPROVED
      | ApprovalExternalStatus.REJECTED,
    appeal_analyze?: string, //! di database tetep nilainya keterangan, tapi di FE ini pertimbangan
    appeal_conclusion?: string,
    appeal_approval_amount?: number,
    appeal_approval_tenor?: number,
    additional_document?: string,
  ) {
    try {
      const now = new Date();
      const approval = new ApprovalExternal(
        { id: loan_id },
        creditAnalystId,
        USERTYPE.CA,
        true,
        undefined,
        appeal_analyze,
        appeal_approval_amount,
        appeal_approval_tenor,
        appeal_response,
        appeal_conclusion,
        additional_document,
        now,
        now,
      );
      const result = await this.approvalExternalRepo.save(approval);

      if (!result) {
        throw new HttpException(
          {
            error: true,
            message: 'CA Appeal response processing failed',
            reference: 'CA_APPEAL_RESPONSE_FAILED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const triggerLoanApplicationInternalStatus =
        await this.loanApplicationExternalRepo.findById(loan_id);
      if (!triggerLoanApplicationInternalStatus) {
        throw new HttpException(
          {
            error: true,
            message: 'CA Appeal response processing failed',
            reference: 'CA_APPEAL_RESPONSE_FAILED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.loanApplicationExternalRepo.update(loan_id, {
        status_pengajuan:
          appeal_response === ApprovalExternalStatus.APPROVED
            ? StatusPengajuanEnum.APPROVED_BANDING_CA
            : StatusPengajuanEnum.REJECTED_BANDING_CA,
      });

      return {
        payload: {
          success: true,
          message: `Loan appeal response created successfully.`,
          reference: 'CA_APPEAL_RESPONSE_SUCCESS',
        },
      };
    } catch (error) {
      console.error(
        `Error in CA_LoanAppealResponseUseCase.execute: ${error.message}`,
      );
      throw error;
    }
  }
}
