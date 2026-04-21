import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientLoanInstallment_ORM_Entity } from '../Infrastructure/Entities/client_loan_installment.orm-entity';
import { ClientLoanInstallmentRepositoryImpl } from '../Infrastructure/Repositories/client_loan_installment.repository.impl';
import { CLIENT_LOAN_INSTALLMENT_REPOSITORY } from '../Domain/Repositories/client_loan_installment.repository';
import { ClientLoanInstallmentService } from '../Applications/Services/client_loan_installment.service';
import { ClientLoanInstallmentController } from '../Presentation/client_loan_installment.controller';
import { ClientInstallmentFrequencyModule } from './client_loan_installment_frequency.module';
import { LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY } from '../Domain/Repositories/log_client_loan_installment.repository';
import { LogClientLoanInstallmentRepositoryImpl } from '../Infrastructure/Repositories/log_client_loan_installment.repository.impl';
import { LogClientLoanInstallmentService } from '../Applications/Services/log_client_loan_installment.service';
import { LogClientLoanInstallment_ORM_Entity } from '../Infrastructure/Entities/log_client_loan_installment.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientLoanInstallment_ORM_Entity,
      LogClientLoanInstallment_ORM_Entity,
    ]),
    ClientInstallmentFrequencyModule, // import parent untuk resolve FK
  ],
  controllers: [ClientLoanInstallmentController],
  providers: [
    {
      provide: CLIENT_LOAN_INSTALLMENT_REPOSITORY,
      useClass: ClientLoanInstallmentRepositoryImpl,
    },
    {
      provide: LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY,
      useClass: LogClientLoanInstallmentRepositoryImpl,
    },
    ClientLoanInstallmentService,
    LogClientLoanInstallmentService,
  ],
  exports: [
    CLIENT_LOAN_INSTALLMENT_REPOSITORY,
    LOG_CLIENT_LOAN_INSTALLMENT_REPOSITORY,
    ClientLoanInstallmentService,
    LogClientLoanInstallmentService,
  ],
})
export class ClientLoanInstallmentModule {}
