import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientLoanInstallmentDetail_ORM_Entity } from '../Infrastructure/Entities/client_loan_installment_detail.orm-entity';
import { ClientLoanInstallmentDetailRepositoryImpl } from '../Infrastructure/Repositories/client_loan_installment_detail.repository.impl';
import { CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY } from '../Domain/Repositories/client_loan_installment_detail.repository';
import { ClientLoanInstallmentDetailService } from '../Applications/Services/client_loan_installment_detail.service';
import { ClientLoanInstallmentDetailController } from '../Presentation/client_loan_installment_detail.controller';
import { ClientLoanInstallmentModule } from './client_loan_installment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientLoanInstallmentDetail_ORM_Entity]),
    ClientLoanInstallmentModule, // import parent untuk resolve FK
  ],
  controllers: [ClientLoanInstallmentDetailController],
  providers: [
    {
      provide: CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY,
      useClass: ClientLoanInstallmentDetailRepositoryImpl,
    },
    ClientLoanInstallmentDetailService,
  ],
  exports: [
    CLIENT_LOAN_INSTALLMENT_DETAIL_REPOSITORY,
    ClientLoanInstallmentDetailService,
  ],
})
export class ClientLoanInstallmentDetailModule {}
