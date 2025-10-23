// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import {
  Controller,
  Inject,
  UseGuards,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { HM_LoanAppealResponseUseCase } from '../../Application/Services/HM_LoanAppealResponse.usecase';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
@Controller('hm/int/loan-apps')
export class HM_LoanAppealResponseController {
  constructor(
    @Inject(HM_LoanAppealResponseUseCase)
    private readonly postAppealResponseUseCase: HM_LoanAppealResponseUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.HM)
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
    },
    @CurrentUser('id') headMarketingId: number,
  ) {
    try {
      const { appeal_response, appeal_consideration, appeal_conclusion } =
        payload;

      const result = await this.postAppealResponseUseCase.execute(
        headMarketingId,
        loan_id,
        appeal_response,
        appeal_consideration,
        appeal_conclusion,
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
