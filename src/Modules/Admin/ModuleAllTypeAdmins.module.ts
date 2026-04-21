// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { AdminBICheckingModule } from './BI-Checking/admin-bi-checking.module';
import { AdminContractsModule } from './Contracts/admin-contracts.module';
import { AdminAccountReceivableModule } from './Account-Receivable/admin-account-receivable.module';
@Module({
  imports: [
    AdminBICheckingModule,
    AdminContractsModule,
    AdminAccountReceivableModule,
  ],
  exports: [
    AdminBICheckingModule,
    AdminContractsModule,
    AdminAccountReceivableModule,
  ],
})
export class AllTypeAdminsModule {}
