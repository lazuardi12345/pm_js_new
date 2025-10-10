import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplicationInternal_ORM_Entity } from '../Infrastructure/Entities/loan-application-internal.orm-entity';
import { LoanApplicationInternalRepositoryImpl } from '../Infrastructure/Repositories/loanApp-internal.repository.impl';
import { LOAN_APPLICATION_INTERNAL_REPOSITORY } from '../Domain/Repositories/loanApp-internal.repository';
import { LoanApplicationInternalService } from '../Application/Services/loan-app-internal.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplicationInternal_ORM_Entity])],

  providers: [
    // ✅ Registrasi token dan implementasi (agar bisa diinject dengan token)
    {
      provide: LOAN_APPLICATION_INTERNAL_REPOSITORY,
      useClass: LoanApplicationInternalRepositoryImpl,
    },
    // ✅ Tambahkan class impl juga ke providers (agar bisa di-export langsung)
    LoanApplicationInternalRepositoryImpl,
    LoanApplicationInternalService,
  ],

  exports: [
    // ✅ Boleh export semua yang kamu butuhkan
    LOAN_APPLICATION_INTERNAL_REPOSITORY,
    LoanApplicationInternalRepositoryImpl,
    LoanApplicationInternalService,
  ],
})
export class LoanApplicationInternalModule {}
