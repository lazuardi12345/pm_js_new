import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientInstallmentFrequency_ORM_Entity } from '../Infrastructure/Entities/client_loan_installment_frequency.orm-entity';
import { ClientInstallmentFrequencyRepositoryImpl } from '../Infrastructure/Repositories/client_loan_installment_frequency.repository.impl';
import { CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY } from '../Domain/Repositories/client_loan_installment_frequency.repository';
import { ClientInstallmentFrequencyService } from '../Applications/Services/client_loan_installment_frequency.service';
import { ClientInstallmentFrequencyController } from '../Presentation/client_loan_installment_frequency.controller';
import { ClientLoanInstallmentInternalModule } from './client_loan_installment_internal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientInstallmentFrequency_ORM_Entity]),
    ClientLoanInstallmentInternalModule, // import parent untuk resolve FK
  ],
  controllers: [ClientInstallmentFrequencyController],
  providers: [
    {
      provide: CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY,
      useClass: ClientInstallmentFrequencyRepositoryImpl,
    },
    ClientInstallmentFrequencyService,
  ],
  exports: [
    CLIENT_INSTALLMENT_FREQUENCY_REPOSITORY,
    ClientInstallmentFrequencyService,
  ],
})
export class ClientInstallmentFrequencyModule {}
