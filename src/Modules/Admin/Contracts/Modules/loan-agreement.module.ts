// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanAggrement_ORM_Entity } from '../Infrastructure/Entities/loan-agreement.orm-entity';
import { LoanAggrementRepositoryImpl } from '../Infrastructure/Repositories/loan-agreements.repository.impl';
import { LOAN_AGREEMENT_REPOSITORY } from '../Domain/Repositories/loan-agreements.repository';
import { LoanAgreementService } from '../Applications/Services/loan-agreements.service';
import { loanAgreementController } from '../Presentation/Controllers/loan-agreement.controller';
import { ContractSequence_ORM_Entity } from '../Infrastructure/Entities/contract-sequence.orm-entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoanAggrement_ORM_Entity,
      ContractSequence_ORM_Entity,
    ]),
  ],
  controllers: [loanAgreementController],
  providers: [
    {
      provide: LOAN_AGREEMENT_REPOSITORY,
      useClass: LoanAggrementRepositoryImpl,
    },
    LoanAgreementService,
  ],
  exports: [LOAN_AGREEMENT_REPOSITORY, LoanAgreementService],
})
export class LoanAgreementModule {}
