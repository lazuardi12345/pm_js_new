// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { DraftLoanApplicationModule } from './Modules/CreateLoanAppInt.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoanApplication,
  LoanApplicationSchema,
} from './Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';

@Module({
  imports: [
    DraftLoanApplicationModule,
    MongooseModule.forFeature(
      [{ name: LoanApplication.name, schema: LoanApplicationSchema }],
      'mongoConnection',
    ),
    // kalau nanti ada module lain tinggal ditambahin dsini
  ],
  exports: [
    DraftLoanApplicationModule,
    MongooseModule.forFeature([
      { name: LoanApplication.name, schema: LoanApplicationSchema },
    ]),
  ],
})
export class DraftsModule {}
