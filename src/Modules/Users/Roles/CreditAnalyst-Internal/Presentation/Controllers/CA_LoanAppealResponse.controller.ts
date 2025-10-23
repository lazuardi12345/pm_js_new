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
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
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
    },
    @CurrentUser('id') creditAnalystId: number,
  ) {
    try {
      const { appeal_response, appeal_consideration, appeal_conclusion } =
        payload;

      const result = await this.postAppealResponseUseCase.execute(
        creditAnalystId,
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
