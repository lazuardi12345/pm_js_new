// Modules/admin.module.ts
import { Module } from '@nestjs/common';
import { ClientLoanInstallmentModule } from './Modules/client_loan_installment.module';
import { ClientLoanInstallmentInternalModule } from './Modules/client_loan_installment_internal.module';
import { ClientInstallmentFrequencyModule } from './Modules/client_loan_installment_frequency.module';
import { ClientLoanInstallmentDetailModule } from './Modules/client_loan_installment_detail.module';

@Module({
  imports: [
    ClientLoanInstallmentModule,
    ClientLoanInstallmentInternalModule,
    ClientInstallmentFrequencyModule,
    ClientLoanInstallmentDetailModule,
  ],
})
export class AdminAccountReceivableModule {}
