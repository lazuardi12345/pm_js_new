// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entitas
import { VouchersModule } from 'src/Modules/Admin/Contracts/Modules/vouchers.module';

//? USE CASE
import { AdCont_CreateVoucherUseCase } from './Applications/Services/AdCont_CreateVoucher.usecase';
import { AdCont_GetAllLoanDataExternalUseCase } from './Applications/Services/AdCont_GetLoanAppExternal.usecase';
//? CONTROLLER;
import { AdCont_CreateVouchersController } from './Presentation/AdCont_CreateVoucher.controller';
import { AdCont_GetAllLoanDataExternalController } from './Presentation/AdCont_GetLoanAppExternal.controller';
import { LoanApplicationExternalModule } from 'src/Modules/LoanAppExternal/Modules/loanApp-external.module';
import { AdCont_GetAllLoanDataInternalController } from './Presentation/AdCont_GetLoanAppInternal.controller';
import { AdCont_GetAllLoanDataInternalUseCase } from './Applications/Services/AdCont_GetLoanAppInternal.usecase';
import { LoanApplicationInternalModule } from 'src/Modules/LoanAppInternal/Modules/loanApp-internal.module';
import { AdCont_GetLoanDetailByIdExternalController } from './Presentation/AdCont_GetLoanDetailByIdExternal.controller';
import { AdCont_GetLoanDetailByIdExternalUseCase } from './Applications/Services/AdCont_GetLoanDetailByIdExternal.usecase';
import { AdCont_GetLoanDetailByIdInternalUseCase } from './Applications/Services/AdCont_GetLoanDetailByIdInternal.usecase';
import { AdCont_GetLoanDetailByIdInternalController } from './Presentation/AdCont_GetLoanDetailByIdInternal.controller';
import { AdCont_CreateLoanAgreementController } from './Presentation/AdCont_CreateLoanAgreement.controller';
import { AdCont_CreateLoanAgreementUseCase } from './Applications/Services/AdCont_CreateLoanAgreement.usecase';
import { Vouchers_ORM_Entity } from 'src/Modules/Admin/Contracts/Infrastructure/Entities/vouchers.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';
import { LoanAggrement_ORM_Entity } from 'src/Modules/Admin/Contracts/Infrastructure/Entities/loan-agreement.orm-entity';
import { LoanAgreementModule } from 'src/Modules/Admin/Contracts/Modules/loan-agreement.module';
@Module({
  imports: [
    VouchersModule,
    LoanApplicationExternalModule,
    LoanApplicationInternalModule,
    LoanAgreementModule,
    TypeOrmModule.forFeature([
      Vouchers_ORM_Entity,
      LoanApplicationExternal_ORM_Entity,
      LoanApplicationInternal_ORM_Entity,
      LoanAggrement_ORM_Entity,
    ]),
  ],
  controllers: [
    AdCont_CreateVouchersController,
    AdCont_CreateLoanAgreementController,
    AdCont_GetAllLoanDataExternalController,
    AdCont_GetAllLoanDataInternalController,
    AdCont_GetLoanDetailByIdExternalController,
    AdCont_GetLoanDetailByIdInternalController,
  ],
  providers: [
    AdCont_CreateVoucherUseCase,
    AdCont_CreateLoanAgreementUseCase,
    AdCont_GetAllLoanDataExternalUseCase,
    AdCont_GetAllLoanDataInternalUseCase,
    AdCont_GetLoanDetailByIdExternalUseCase,
    AdCont_GetLoanDetailByIdInternalUseCase,
  ],
})
export class AdminContractUseCaseModule {}
