import { Controller, Post, Body } from '@nestjs/common';
import { AdCont_CreateLoanAgreementUseCase } from '../Applications/Services/AdCont_CreateLoanAgreement.usecase';
import { CreateLoanAgreementDto } from '../Applications/DTOS/AdCont_CreateAgrementContractPayload.dto';

@Controller('adcont')
export class AdCont_CreateLoanAgreementController {
  constructor(
    private readonly createLoanUseCase: AdCont_CreateLoanAgreementUseCase,
  ) {}

  @Post('create/loan-agreement')
  async createLoan(@Body() dto: CreateLoanAgreementDto) {
    const loan = await this.createLoanUseCase.execute(dto);
    return {
      payload: {
        error: false,
        message: 'Loan created successfully with contract',
        data: loan,
      },
    };
  }
}
