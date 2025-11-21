// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanGuarantorExternal_ORM_Entity } from '../Infrastructure/Entities/loan-guarantor.orm-entity';
import { LoanGuarantorExternalRepositoryImpl } from '../Infrastructure/Repositories/loan-guarantor-external.repository.impl';
import { LOAN_GUARANTOR_EXTERNAL_REPOSITORY } from '../Domain/Repositories/loan-guarantor-external.repository';
import { LoanGuarantorExternalService } from '../Application/Services/loan-guarantor-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoanGuarantorExternal_ORM_Entity])],
  providers: [
    LoanGuarantorExternalService,
    {
      provide: LOAN_GUARANTOR_EXTERNAL_REPOSITORY,
      useClass: LoanGuarantorExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    LoanGuarantorExternalService,
    LOAN_GUARANTOR_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class LoanGuarantorExternalModule {}
