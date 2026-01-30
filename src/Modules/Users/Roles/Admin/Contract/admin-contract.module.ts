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
@Module({
  imports: [
    VouchersModule,
    LoanApplicationExternalModule,
    LoanApplicationInternalModule,
    TypeOrmModule.forFeature([
      VouchersModule,
      LoanApplicationExternalModule,
      LoanApplicationInternalModule,
    ]),
  ],
  controllers: [
    AdCont_CreateVouchersController,
    AdCont_GetAllLoanDataExternalController,
    AdCont_GetAllLoanDataInternalController,
    AdCont_GetLoanDetailByIdExternalController,
  ],
  providers: [
    AdCont_CreateVoucherUseCase,
    AdCont_GetAllLoanDataExternalUseCase,
    AdCont_GetAllLoanDataInternalUseCase,
    AdCont_GetLoanDetailByIdExternalUseCase,
  ],
})
export class AdminContractUseCaseModule {}
