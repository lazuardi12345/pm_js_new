// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { AdminBICheckingModule } from './BI-Checking/Modules/admin-bi-checking.module';
@Module({
  imports: [
    AdminBICheckingModule,
    // ApprovalInternalModule,
    // ClientInternalModule,
    // CollateralInternalModule,
    // JobInternalModule,
    // FamilyInternalModule,
    // LoanApplicationInternalModule,
    // RelativeInternalModule,
    // kalau nanti ada module lain (RepeatOrderInternalModule, LoanInternalModule, dll) tinggal ditambahin sini
  ],
  controllers: [
    // AddressInternalController,
    // ApprovalInternalController,
    // ClientInternalController,
    // CollateralInternalController,
    // FamilyInternalController,
    // JobInternalController,
    // LoanApplicationInternalController,
    // RelativeInternalController,
  ],
  exports: [
    AdminBICheckingModule,
    // ApprovalInternalModule,
    // ClientInternalModule,
    // CollateralInternalModule,
    // JobInternalModule,
    // FamilyInternalModule,
    // LoanApplicationInternalModule,
  ],
})
export class AllTypeAdminsModule {}
