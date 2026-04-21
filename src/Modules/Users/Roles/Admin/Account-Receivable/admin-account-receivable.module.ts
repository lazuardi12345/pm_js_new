// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientLoanInstallmentDetailModule } from 'src/Modules/Admin/Account-Receivable/Modules/client_loan_installment_detail.module';
import { ClientInstallmentFrequencyModule } from 'src/Modules/Admin/Account-Receivable/Modules/client_loan_installment_frequency.module';
import { ClientLoanInstallmentModule } from 'src/Modules/Admin/Account-Receivable/Modules/client_loan_installment.module';
import { ClientLoanInstallmentInternalModule } from 'src/Modules/Admin/Account-Receivable/Modules/client_loan_installment_internal.module';
import { AdAR_GetAllClientLoanInstallmentInternalController } from './Presentation/AdAR_GetAllClientLoanInstallmentInternal.controller';
import { AdAR_GetAllClientLoanInstallmentInternalUseCase } from './Applications/AdAR_GetAllClientLoanInstallmentInternal.usecase';
import { AdAR_GetClientDetailByUUIDUseCase } from './Applications/AdAR_GetClientByUUID.usecase';
import { AdAR_GetClientDetailByUUID_Controller } from './Presentation/AdAR_GetClientByUUID.controller';
import { AdAR_GetClientInstallmentDetailController } from './Presentation/AdAR_GetClientInstallmentDetailByUUID.controller';
import { AdAR_GetClientInstallmentDetailUseCase } from './Applications/AdAR_GetClientInstallmentDetailByUUID.usecase';
import { AdAR_CreateInstallmentPaymentController } from './Presentation/AdAR_CreateInstallmentPayment.controller';
import { AdAR_CreateInstallmentPaymentUseCase } from './Applications/AdAR_CreateInstallmentPayment.usecase';
import { AdAR_AddExpectedPayoutInLoanFrequencyController } from './Presentation/AdAR_AddExpectedPayoutInLoanFrequency.controller.ts.controller';
import { AdAR_AddExpectedPayoutInLoanFrequencyUseCase } from './Applications/AdAR_AddExpectedPayoutInLoanFrequency.usecase';
import { AdAR_MarkBadDebtUseCase } from './Applications/AdAR_MarkAsBadDebt.usecase';
import { AdAR_MarkBadDebtController } from './Presentation/AdAR_MarkAsBadDebt.controller';
import { AdAR_GetAllClientSearchDataController } from './Presentation/AdAR_GetAllClientSearchData.controller';
import { AdAR_GetAllClientSearchDataUseCase } from './Applications/AdAr_GetAllClientSearchData.usecase';
import { LoanAgreementModule } from 'src/Modules/Admin/Contracts/Modules/loan-agreement.module';
import { AdAR_GetExportableCSVDataController } from './Presentation/AdAR_GetExportableCSVData.controller';
import { AdAR_GetExportableCSVDataUseCase } from './Applications/AdAR_GetExportableCSVData.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ClientLoanInstallmentDetailModule,
    ClientInstallmentFrequencyModule,
    ClientLoanInstallmentInternalModule,
    ClientLoanInstallmentModule,
    LoanAgreementModule,
  ],
  controllers: [
    AdAR_GetAllClientLoanInstallmentInternalController,
    AdAR_GetClientDetailByUUID_Controller,
    AdAR_GetClientInstallmentDetailController,
    AdAR_CreateInstallmentPaymentController,
    AdAR_AddExpectedPayoutInLoanFrequencyController,
    AdAR_MarkBadDebtController,
    AdAR_GetAllClientSearchDataController,
    AdAR_GetExportableCSVDataController,
  ],
  providers: [
    AdAR_GetAllClientLoanInstallmentInternalUseCase,
    AdAR_GetClientDetailByUUIDUseCase,
    AdAR_GetClientInstallmentDetailUseCase,
    AdAR_CreateInstallmentPaymentUseCase,
    AdAR_AddExpectedPayoutInLoanFrequencyUseCase,
    AdAR_MarkBadDebtUseCase,
    AdAR_GetAllClientSearchDataUseCase,
    AdAR_GetExportableCSVDataUseCase,
  ],
})
export class AdminAccountReceivableUseCaseModule {}
