// Modules/admin.module.ts
import { Module } from '@nestjs/common';
import { RepaymentDataModule } from './Modules/repayment-data.module';
import { LoanAgreementModule } from './Modules/loan-agreement.module';
import { VouchersModule } from './Modules/vouchers.module';

@Module({
  imports: [RepaymentDataModule, LoanAgreementModule, VouchersModule],
})
export class AdminContractsModule {}
