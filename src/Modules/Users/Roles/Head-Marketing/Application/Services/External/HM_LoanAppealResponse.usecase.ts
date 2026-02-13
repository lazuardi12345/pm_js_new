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

export class HM_LoanAppealResponseExternalUseCase {
  constructor(
    @Inject(APPROVAL_EXTERNAL_REPOSITORY)
    private readonly approvalExternalRepo: IApprovalExternalRepository,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanApplicationExternalRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(
    headMarketingId: number,
    loan_id: number,
    appeal_response:
      | ApprovalExternalStatus.APPROVED
      | ApprovalExternalStatus.REJECTED,
    appeal_consideration?: string, //! di database tetep nilainya keterangan, tapi di FE ini pertimbangan
    appeal_conclusion?: string,
    appeal_approval_tenor?: number,
    appeal_approval_amount?: number,
    additional_document?: string,
  ) {
    try {
      const now = new Date();
      const approval = new ApprovalExternal(
        { id: loan_id },
        headMarketingId,
        USERTYPE.HM,
        true,
        undefined,
        appeal_consideration,
        appeal_approval_tenor,
        appeal_approval_amount,
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
            message: 'Head Marketing Appeal response processing failed',
            reference: 'HM_APPEAL_RESPONSE_FAILED',
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
            message: 'Head Marketing Appeal response processing failed',
            reference: 'HM_APPEAL_RESPONSE_FAILED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.loanApplicationExternalRepo.update(loan_id, {
        status_pengajuan:
          appeal_response === ApprovalExternalStatus.APPROVED
            ? StatusPengajuanEnum.APPROVED_BANDING_HM
            : StatusPengajuanEnum.REJECTED_BANDING_HM,
      });

      return {
        payload: {
          success: true,
          message: `Loan appeal response created successfully.`,
          reference: 'HM_APPEAL_RESPONSE_SUCCESS',
        },
      };
    } catch (error) {
      console.error(
        `Error in HM_LoanAppealResponseUseCase.execute: ${error.message}`,
      );
      throw error;
    }
  }
}
