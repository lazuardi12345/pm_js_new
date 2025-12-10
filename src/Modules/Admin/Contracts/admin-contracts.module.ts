// Modules/admin.module.ts
import { Module } from '@nestjs/common';
import { RepaymentDataModule } from './Modules/repayment-data.module';
import { LoanAgreementModule } from './Modules/loan-agreement.module';

@Module({
  imports: [RepaymentDataModule, LoanAgreementModule],
})
export class AdminContractsModule {}
