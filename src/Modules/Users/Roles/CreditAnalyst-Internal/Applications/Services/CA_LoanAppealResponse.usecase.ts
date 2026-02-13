import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ApprovalInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/approval-internal.entity';
import { LoanApplicationInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/loan-application-internal.entity';
import {
  APPROVAL_INTERNAL_REPOSITORY,
  IApprovalInternalRepository,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/approval-internal.repository';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

export class CA_LoanAppealResponseUseCase {
  constructor(
    @Inject(APPROVAL_INTERNAL_REPOSITORY)
    private readonly approvalInternalRepo: IApprovalInternalRepository,
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanApplicationInternalRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(
    creditAnalystId: number,
    loan_id: number,
    appeal_response:
      | ApprovalInternalStatusEnum.APPROVED
      | ApprovalInternalStatusEnum.REJECTED,
    appeal_consideration?: string, //! di database tetep nilainya keterangan, tapi di FE ini pertimbangan
    appeal_conclusion?: string,
    nominal_persetujuan?: number,
    tenor_persetujuan?: number,
    dokumen_pendukung?: string,
  ) {
    try {
      const now = new Date();
      const approval = new ApprovalInternal(
        loan_id,
        { id: creditAnalystId },
        USERTYPE.CA,
        appeal_response,
        tenor_persetujuan,
        nominal_persetujuan,
        true,
        undefined,
        appeal_consideration,
        appeal_conclusion,
        dokumen_pendukung,
        now,
        now,
      );
      const result = await this.approvalInternalRepo.save(approval);

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
        await this.loanApplicationInternalRepo.findById(loan_id);
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

      await this.loanApplicationInternalRepo.update(loan_id, {
        status:
          appeal_response === ApprovalInternalStatusEnum.APPROVED
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
