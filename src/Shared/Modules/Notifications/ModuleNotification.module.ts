// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { NotifLoanAppInternal_Controller } from './Presentations/Controllers/NotifLoanAppInternal.controller';
import { NotifCreateLoanAppIntModule } from './Modules/NotifLoanAppInt.module';

@Module({
  imports: [
    NotifCreateLoanAppIntModule,
    // kalau nanti ada module lain tinggal ditambahin dsini
  ],
  controllers: [NotifLoanAppInternal_Controller],
  exports: [NotifCreateLoanAppIntModule],
})
export class NotificationsModule {}
