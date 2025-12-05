// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { SPV_GetLoanApplicationByIdUseCase } from '../../Applications/Services/SPV_GetLoanApplicationById.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { LoanType } from 'src/Shared/Enums/External/Loan-Application.enum';
@Controller('spv/ext/loan-apps')
export class SPV_GetLoanApplicationByIdController {
  constructor(
    @Inject(SPV_GetLoanApplicationByIdUseCase)
    private readonly getLoanAppByIdUseCase: SPV_GetLoanApplicationByIdUseCase,
  ) {}

  @Public()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(USERTYPE.SPV)
  // @Public()
  @Get('detail/:type/:id')
  async getLoanApplicationById(
    @Param('id') id: number,
    @Param('type') type: LoanType,
  ) {
    try {
      const payload = await this.getLoanAppByIdUseCase.execute(id, type);

      return {
        payload,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
