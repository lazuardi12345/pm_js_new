// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import {
  Controller,
  Inject,
  UseGuards,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { HM_LoanAppealResponseExternalUseCase } from '../../../Application/Services/External/HM_LoanAppealResponse.usecase';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
@Controller('hm/ext/loan-apps')
export class HM_LoanAppealResponseExternalController {
  constructor(
    private readonly postAppealResponseUseCase: HM_LoanAppealResponseExternalUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.HM)
  @Post('appeal-response/:id')
  async postAppealResponse(
    @Param('id') loan_id: number,
    @Body('payload')
    payload: {
      appeal_response:
        | ApprovalExternalStatus.APPROVED
        | ApprovalExternalStatus.REJECTED;
      appeal_consideration?: string;
      appeal_conclusion?: string;
      appeal_approval_tenor?: number;
      appeal_approval_amount?: number;
      additional_document?: string;
    },
    @CurrentUser('id') headMarketingId: number,
  ) {
    try {
      const {
        appeal_response,
        appeal_consideration,
        appeal_conclusion,
        appeal_approval_tenor,
        appeal_approval_amount,
        additional_document,
      } = payload;

      const result = await this.postAppealResponseUseCase.execute(
        headMarketingId,
        loan_id,
        appeal_response,
        appeal_consideration,
        appeal_conclusion,
        appeal_approval_tenor,
        appeal_approval_amount,
        additional_document,
      );

      return result;
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
