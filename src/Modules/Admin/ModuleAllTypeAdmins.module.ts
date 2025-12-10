// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { AdminBICheckingModule } from './BI-Checking/admin-bi-checking.module';
import { AdminContractsModule } from './Contracts/admin-contracts.module';
@Module({
  imports: [
    AdminBICheckingModule,
    AdminContractsModule,
    // ApprovalInternalModule,
    // ClientInternalModule,
    // CollateralInternalModule,
    // JobInternalModule,
    // FamilyInternalModule,
    // LoanApplicationInternalModule,
    // RelativeInternalModule,
    // kalau nanti ada module lain (RepeatOrderInternalModule, LoanInternalModule, dll) tinggal ditambahin sini
  ],
  exports: [
    AdminBICheckingModule,
    AdminContractsModule,
    // ApprovalInternalModule,
    // ClientInternalModule,
    // CollateralInternalModule,
    // JobInternalModule,
    // FamilyInternalModule,
    // LoanApplicationInternalModule,
  ],
})
export class AllTypeAdminsModule {}
