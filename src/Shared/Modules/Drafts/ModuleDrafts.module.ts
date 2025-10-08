// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { DraftLoanApplicationModule } from './Modules/CreateLoanAppInt.module';

@Module({
  imports: [
    DraftLoanApplicationModule,
    // kalau nanti ada module lain tinggal ditambahin dsini
  ],
  //ga perlu controller, soalnya udah di define di module
  exports: [DraftLoanApplicationModule],
})
export class DraftsModule {}
