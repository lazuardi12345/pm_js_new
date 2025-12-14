// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanAggrement_ORM_Entity } from '../Infrastructure/Entities/loan-agreement.orm-entity';
import { LoanAggrementRepositoryImpl } from '../Infrastructure/Repositories/loan-agreements.repository.impl';
import { LOAN_AGREEMENT_REPOSITORY } from '../Domain/Repositories/loan-agreements.repository';
import { LoanAgreementService } from '../Applications/Services/loan-agreements.service';
import { loanAgreementController } from '../Presentation/Controllers/loan-agreement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoanAggrement_ORM_Entity])],
  controllers: [loanAgreementController],
  providers: [
    {
      provide: LOAN_AGREEMENT_REPOSITORY,
      useClass: LoanAggrementRepositoryImpl,
    },
    LoanAgreementService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    LOAN_AGREEMENT_REPOSITORY,
    LoanAgreementService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class LoanAgreementModule {}
