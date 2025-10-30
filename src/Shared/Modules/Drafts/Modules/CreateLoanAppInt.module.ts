import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoanApplication,
  LoanApplicationSchema,
} from '../Infrastructure/Schemas/LoanAppInternal/CreateLoanApplicaton_Marketing.schema';
import { CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY } from '../Domain/Repositories/LoanAppInt.repository';
import { LoanApplicationRepositoryImpl } from '../Infrastructure/Repositories/LoanApplicationInternal/ClientInternal.repository.impl';
import { CreateDraftLoanApplicationController } from '../Presentations/Controllers/Drafts.controller';
import { CreateDraftLoanApplicationUseCase } from '../Applications/Services/LoanAppInternal/CreateLoanApplication_Marketing.usecase';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: LoanApplication.name, schema: LoanApplicationSchema }],
      'mongoConnection',
    ),
  ],
  providers: [
    {
      provide: CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY,
      useClass: LoanApplicationRepositoryImpl,
    },
    CreateDraftLoanApplicationUseCase,
  ],
  controllers: [CreateDraftLoanApplicationController],
  exports: [
    CreateDraftLoanApplicationUseCase,
    CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY,
  ],
})
export class DraftLoanApplicationModule {}
