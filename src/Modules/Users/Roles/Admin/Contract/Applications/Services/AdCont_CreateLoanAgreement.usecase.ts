import { Injectable, Inject } from '@nestjs/common';

import { LoanAgreement } from 'src/Modules/Admin/Contracts/Domain/Entities/loan-agreements.entity';
import { CreateLoanAgreementDto } from '../DTOS/AdCont_CreateAgrementContractPayload.dto';
import {
  ILoanAgreementRepository,
  LOAN_AGREEMENT_REPOSITORY,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/loan-agreements.repository';

@Injectable()
export class AdCont_CreateLoanAgreementUseCase {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly loanRepo: ILoanAgreementRepository,
  ) {}

  async execute(dto: CreateLoanAgreementDto): Promise<LoanAgreement> {
    const savedLoan = await this.loanRepo.generateAndSave(dto);
    return savedLoan;
  }
}
