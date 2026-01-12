// src/Modules/LoanAppInternal/Presentation/Controllers/HM_GetLoanApplicationById.controller.ts
import { Controller, Get, Inject, UseGuards, Param } from '@nestjs/common';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { HM_GetLoanApplicationByIdExternalUseCase } from '../../../Application/Services/External/HM_GetLoanApplicationById.usecase';

@Controller('hm/ext/loan-apps')
export class HM_GetLoanApplicationByIdExternalController {
  constructor(
    private readonly getLoanAppByIdUseCase: HM_GetLoanApplicationByIdExternalUseCase,
  ) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(USERTYPE.HM)
  @Public()
  @Get('detail/:id')
  async getLoanApplicationById(@Param('id') id: number) {
    if (isNaN(Number(id))) {
      // bukan angka
    }

    try {
      const payload = await this.getLoanAppByIdUseCase.execute(id);

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
