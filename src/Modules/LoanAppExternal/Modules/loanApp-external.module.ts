// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplicationExternal_ORM_Entity } from '../Infrastructure/Entities/loan-application-external.orm-entity';
import { LoanApplicationExternalRepositoryImpl } from '../Infrastructure/Repositories/loanApp-external.repository.impl';
import { LOAN_APPLICATION_EXTERNAL_REPOSITORY } from '../Domain/Repositories/loanApp-external.repository';
import { LoanApplicationExternalService } from '../Application/Services/loanApp-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplicationExternal_ORM_Entity])],
  providers: [
    LoanApplicationExternalService,
    {
      provide: LOAN_APPLICATION_EXTERNAL_REPOSITORY,
      useClass: LoanApplicationExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    LoanApplicationExternalService,
    LOAN_APPLICATION_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class LoanApplication_External_Module {}
