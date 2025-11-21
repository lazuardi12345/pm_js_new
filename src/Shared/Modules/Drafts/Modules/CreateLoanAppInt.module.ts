import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoanApplicationInt,
  LoanApplicationIntSchema,
} from '../Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY } from '../Domain/Repositories/int/LoanAppInt.repository';
import { LoanApplicationIntRepositoryImpl } from '../Infrastructure/Repositories/LoanApplicationInternal/ClientInternal.repository.impl';
import { CreateDraftLoanApplicationController } from '../Presentations/Controllers/Drafts.controller';
import { CreateDraftLoanApplicationUseCase } from '../Applications/Services/LoanAppInternal/CreateLoanApplication_Marketing.usecase';
import {
  LoanApplicationExt,
  LoanApplicationExtSchema,
} from '../Infrastructure/Schemas/LoanAppExternal/CreateLoanApplicaton_Marketing.schema';
import { DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY } from '../Domain/Repositories/ext/LoanAppInt.repository';
import { LoanApplicationExtRepositoryImpl } from '../Infrastructure/Repositories/LoanApplicationExternal/ClientExternal.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: LoanApplicationInt.name, schema: LoanApplicationIntSchema },
        { name: LoanApplicationExt.name, schema: LoanApplicationExtSchema },
      ],
      'mongoConnection',
    ),
  ],
  providers: [
    {
      provide: DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY,
      useClass: LoanApplicationIntRepositoryImpl,
    },
    {
      provide: DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
      useClass: LoanApplicationExtRepositoryImpl,
    },
    CreateDraftLoanApplicationUseCase,
  ],
  controllers: [CreateDraftLoanApplicationController],
  exports: [
    CreateDraftLoanApplicationUseCase,
    DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY,
  ],
})
export class DraftLoanApplicationModule {}
