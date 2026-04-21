import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientLoanInstallmentInternal_ORM_Entity } from '../Infrastructure/Entities/client_loan_installment_internal.orm-entity';
import { ClientLoanInstallmentInternalRepositoryImpl } from '../Infrastructure/Repositories/client_loan_installment_internal.repository.impl';
import { CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY } from '../Domain/Repositories/client_loan_installment_internal.repository';
import { ClientLoanInstallmentInternalService } from '../Applications/Services/client_loan_installment_internal.service';
import { ClientLoanInstallmentInternalController } from '../Presentation/client_loan_installment_internal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientLoanInstallmentInternal_ORM_Entity]),
  ],
  controllers: [ClientLoanInstallmentInternalController],
  providers: [
    {
      provide: CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY,
      useClass: ClientLoanInstallmentInternalRepositoryImpl,
    },
    ClientLoanInstallmentInternalService,
  ],
  exports: [
    CLIENT_LOAN_INSTALLMENT_INTERNAL_REPOSITORY,
    ClientLoanInstallmentInternalService,
  ],
})
export class ClientLoanInstallmentInternalModule {}
