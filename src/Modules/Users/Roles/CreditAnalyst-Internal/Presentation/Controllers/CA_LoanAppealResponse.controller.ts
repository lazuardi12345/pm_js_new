// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import {
  Controller,
  Inject,
  UseGuards,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { CA_LoanAppealResponseUseCase } from '../../Applications/Services/CA_LoanAppealResponse.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
@Controller('ca/int/loan-apps')
export class CA_LoanAppealResponseController {
  constructor(
    @Inject(CA_LoanAppealResponseUseCase)
    private readonly postAppealResponseUseCase: CA_LoanAppealResponseUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.CA)
  @Post('appeal-response/:id')
  async postAppealResponse(
    @Param('id') loan_id: number,
    @Body('payload')
    payload: {
      appeal_response:
        | ApprovalInternalStatusEnum.APPROVED
        | ApprovalInternalStatusEnum.REJECTED;
      appeal_consideration?: string;
      appeal_conclusion?: string;
      appeal_approval_amount?: number;
      appeal_approval_tenor?: number;
      additional_document?: string;
    },
    @CurrentUser('id') creditAnalystId: number,
  ) {
    try {
      const {
        appeal_response,
        appeal_consideration,
        appeal_conclusion,
        appeal_approval_amount,
        appeal_approval_tenor,
        additional_document,
      } = payload;

      const result = await this.postAppealResponseUseCase.execute(
        creditAnalystId,
        loan_id,
        appeal_response,
        appeal_consideration,
        appeal_conclusion,
        appeal_approval_amount,
        appeal_approval_tenor,
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
