// Presentation/ModuleLoanApplicationInternal.module.ts
import { Module } from '@nestjs/common';
import { DraftLoanApplicationModule } from './Modules/CreateLoanAppInt.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoanApplicationInt,
  LoanApplicationIntSchema,
} from './Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { DraftRepeatOrderModule } from './Modules/DraftRepeatOrder.module';
import {
  RepeatOrder,
  RepeatOrderIntSchema,
} from './Infrastructure/Schemas/LoanAppInternal/RepeatOrder_Marketing.schema';
import {
  LoanApplicationExt,
  LoanApplicationExtSchema,
} from './Infrastructure/Schemas/LoanAppExternal/CreateLoanApplicaton_Marketing.schema';

@Module({
  imports: [
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    MongooseModule.forFeature(
      [
        { name: LoanApplicationInt.name, schema: LoanApplicationIntSchema },
        { name: LoanApplicationExt.name, schema: LoanApplicationExtSchema },
        { name: RepeatOrder.name, schema: RepeatOrderIntSchema },
      ],
      'mongoConnection',
    ),
    // kalau nanti ada module lain tinggal ditambahin dsini
  ],
  exports: [
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    MongooseModule.forFeature([
      { name: LoanApplicationInt.name, schema: LoanApplicationIntSchema },
      { name: LoanApplicationExt.name, schema: LoanApplicationExtSchema },
      { name: RepeatOrder.name, schema: RepeatOrderIntSchema },
    ]),
  ],
})
export class DraftsModule {}
