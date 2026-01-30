// src/Modules/LoanAppInternal/Presentation/Controllers/loanApp-internal.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { CA_GetLoanApplicationByIdUseCase } from '../../Applications/Services/CA_GetLoanApplicationById.usecase';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
@Controller('ca/ext/loan-apps')
export class CA_GetLoanApplicationByIdController {
  constructor(
    @Inject(CA_GetLoanApplicationByIdUseCase)
    private readonly getLoanAppByIdUseCase: CA_GetLoanApplicationByIdUseCase,
  ) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(USERTYPE.CA)
  @Public()
  @Get('detail/:id')
  async getLoanApplicationById(@Param('id') id: number) {
    try {
      console.log(id);
      const payload = await this.getLoanAppByIdUseCase.execute(id);

      return {
        payload,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
