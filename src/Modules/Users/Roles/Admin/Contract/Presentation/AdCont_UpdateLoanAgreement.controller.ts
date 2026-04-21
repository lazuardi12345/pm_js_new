import { Controller, Body, Patch, Param } from '@nestjs/common';
import { AdCont_UpdateLoanAgreementUseCase } from '../Applications/Services/AdCont_UpdateLoanAgreement.usecase';
import { UpdateLoanAgreementDto } from 'src/Modules/Admin/Contracts/Applications/DTOS/dto-Loan-Agreement/update-loan-agreement.dto';

@Controller('adcont')
export class AdCont_UpdateLoanAgreementController {
  constructor(
    private readonly updateLoanUseCase: AdCont_UpdateLoanAgreementUseCase,
  ) {}

  @Patch('update/loan-agreement/:id')
  async createLoan(
    @Param('id') id: number,
    @Body() dto: UpdateLoanAgreementDto,
  ) {
    const loan = await this.updateLoanUseCase.execute(id, dto);
    return {
      payload: {
        error: false,
        message: 'Loan data updated successfully with contract',
        data: loan,
      },
    };
  }
}
