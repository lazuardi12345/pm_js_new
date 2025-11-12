// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { DraftLoanApplicationModule } from './Modules/CreateLoanAppInt.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoanApplication,
  LoanApplicationSchema,
} from './Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { DraftRepeatOrderModule } from './Modules/DraftRepeatOrder.module';
import {
  RepeatOrder,
  RepeatOrderSchema,
} from './Infrastructure/Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';

@Module({
  imports: [
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    MongooseModule.forFeature(
      [
        { name: LoanApplication.name, schema: LoanApplicationSchema },
        { name: RepeatOrder.name, schema: RepeatOrderSchema },
      ],
      'mongoConnection',
    ),
    // kalau nanti ada module lain tinggal ditambahin dsini
  ],
  exports: [
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    MongooseModule.forFeature([
      { name: LoanApplication.name, schema: LoanApplicationSchema },
      { name: RepeatOrder.name, schema: RepeatOrderSchema },
    ]),
  ],
})
export class DraftsModule {}
