// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';

// ORM entities
import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
import { ClientExternalProfile_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external-profile.orm-entity';
import { AddressExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/address-external.orm-entity';
import { JobExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/job.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';
import { EmergencyContactExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/emergency-contact.orm-entity';
import { FinancialDependentsExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/financial-dependents.orm-entity';
import { LoanGuarantorExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-guarantor.orm-entity';
import { OtherExistLoansExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/other-exist-loans.orm-entity';
import { CollateralByBPJS_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-bpjs.orm-entity';
import { CollateralByBPKB_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-bpkb.orm-entity';
import { CollateralBySHM_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-shm.orm-entity';
import { CollateralByUMKM_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-umkm.orm.entity';
import { CollateralByKedinasan_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-kedinasan-mou.orm-entity';
import { CollateralByKedinasan_Non_MOU_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-kedinasan-non-mou.orm-entity';

// Tokens & infra impl
import { UNIT_OF_WORK } from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { TypeOrmUnitOfWork } from 'src/Modules/LoanAppInternal/Infrastructure/Repositories/UnitOfWork.repository.impl';

import { FILE_STORAGE_SERVICE } from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import { MinioFileStorageService } from 'src/Shared/Modules/Storage/Infrastructure/Service/ObjectStorageServer.service';

// Usecases
import { MKT_CreateLoanApplicationUseCase } from './Applications/Services/MKT_CreateLoanApplication.usecase';
import { MKT_GetAllLoanApplicationUseCase } from './Applications/Services/MKT_GetAllLoanApplication.usecase';
import { MKT_GetLoanApplicationByIdUseCase } from './Applications/Services/MKT_GetLoanApplicationById.usecase';
import { MKT_CreateDraftLoanApplicationUseCase } from './Applications/Services/MKT_CreateDraftLoanApp.usecase';
import { MKT_UpdateLoanApplicationUseCase } from './Applications/Services/MKT_UpdateLoanApplication.usecase';
import { MKT_TriggerAppealUseCase } from './Applications/Services/MKT_TriggerAppeal.usecase';
import { MKT_GetDashboardStatsUseCase } from './Applications/Services/MKT_GetDashboardStats.usecase';
import { MKT_TriggerFinalLoanStatusUseCase } from './Applications/Services/MKT_TriggerFinalLoan.usecase';
import { MKT_GetClientsDatabaseUseCase } from './Applications/Services/MKT_GetClientsDatabase.usecase';
import { MKT_CreateRepeatOrderUseCase } from './Applications/Services/MKT_CreateRepeatOrder.usecase';
import { MKT_GetAllRepeatOrderHistoryUseCase } from './Applications/Services/MKT_GetAllRepeatOrderHistory.usecase';

// Controllers
import { MKT_CreateLoanApplicationController } from './Presentation/Controllers/MKT_CreateLoanApplication.controller';
import { MKT_GetAllLoanApplicationController } from './Presentation/Controllers/MKT_GetAllLoanApplication.controller';
import { MKT_UpdateLoanApplicationController } from './Presentation/Controllers/MKT_UpdateLoanApplication.controller';
import { MKT_GetLoanApplicationByIdController } from './Presentation/Controllers/MKT_GetLoanApplicationById.controller';
import { MKT_CreateDraftLoanApplicationController } from './Presentation/Controllers/MKT_CreateDraftLoanApp.controller';
import { MKT_GetDashboardStatsController } from './Presentation/Controllers/MKT_GetDashboardStats.controller';
import { MKT_TriggerAppealController } from './Presentation/Controllers/MKT_TriggerAppeal.controller';
import { MKT_TriggerFinalLoanStatusController } from './Presentation/Controllers/MKT_TriggerFinalLoan.controller';
import { MKT_GetClientDatabaseController } from './Presentation/Controllers/MKT_GetClientsDatabase.controller';
import { MKT_CreateRepeatOrderController } from './Presentation/Controllers/MKT_CreateRepeatOrder.controller';
import { MKT_GetAllRepeatOrderHistoryController } from './Presentation/Controllers/MKT_GetAllRepeatOrderHistory.controller';

import { AddressExternalModule } from 'src/Modules/LoanAppExternal/Modules/address-external.module';
import { ApprovalExternalModule } from 'src/Modules/LoanAppExternal/Modules/approval-external.module';
import { ClientExternalModule } from 'src/Modules/LoanAppExternal/Modules/client-external.module';
import { ClientExternalProfileModule } from 'src/Modules/LoanAppExternal/Modules/client-external-profile.module';
import { JobsExternalModule } from 'src/Modules/LoanAppExternal/Modules/job-external.module';
import { LoanApplicationExternalModule } from 'src/Modules/LoanAppExternal/Modules/loanApp-external.module';
import { LoanGuarantorExternalModule } from 'src/Modules/LoanAppExternal/Modules/loan-guarantor-external.module';
import { EmergencyContactExternalModule } from 'src/Modules/LoanAppExternal/Modules/emergency-contact-external.module';
import { FinancialDependentsExternalModule } from 'src/Modules/LoanAppExternal/Modules/financial-dependents-external.module';
import { OtherExistLoansExternalModule } from 'src/Modules/LoanAppExternal/Modules/other-exist-loans-external.module';
import { CollateralByBPJS_External_Module } from 'src/Modules/LoanAppExternal/Modules/collateral-bpjs-external.module';
import { CollateralByBPKB_External_Module } from 'src/Modules/LoanAppExternal/Modules/collateral-bpkb-external.module';
import { CollateralBySHM_External_Module } from 'src/Modules/LoanAppExternal/Modules/collateral-shm-external.module';
import { CollateralByUMKM_External_Module } from 'src/Modules/LoanAppExternal/Modules/collateral-umkm.module';
import { CollateralByKedinasan_MOU_External_Module } from 'src/Modules/LoanAppExternal/Modules/collateral-kedinasan-mou-external.module';
import { CollateralByKedinasan_Non_MOU_External_Module } from 'src/Modules/LoanAppExternal/Modules/collateral-kedinasan-non-mou-external.module';

import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

import { DraftLoanApplicationModule } from 'src/Shared/Modules/Drafts/Modules/CreateLoanAppInt.module';
import { ApprovalRecommendationModule } from 'src/Modules/Admin/BI-Checking/Modules/approval-recommendation.module';
import { DraftRepeatOrderModule } from 'src/Shared/Modules/Drafts/Modules/DraftRepeatOrder.module';
@Module({
  imports: [
    HttpModule,
    DraftLoanApplicationModule,
    AddressExternalModule,
    ApprovalExternalModule,
    ClientExternalModule,
    ClientExternalProfileModule,
    JobsExternalModule,
    LoanApplicationExternalModule,
    LoanGuarantorExternalModule,
    EmergencyContactExternalModule,
    FinancialDependentsExternalModule,
    OtherExistLoansExternalModule,
    CollateralByBPJS_External_Module,
    CollateralByBPKB_External_Module,
    CollateralByKedinasan_MOU_External_Module,
    CollateralByKedinasan_Non_MOU_External_Module,
    CollateralBySHM_External_Module,
    CollateralByUMKM_External_Module,
    TypeOrmModule.forFeature([
      ClientExternal_ORM_Entity,
      ClientExternalProfile_ORM_Entity,
      AddressExternal_ORM_Entity,
      JobExternal_ORM_Entity,
      LoanApplicationExternal_ORM_Entity,
      EmergencyContactExternal_ORM_Entity,
      FinancialDependentsExternal_ORM_Entity,
      LoanGuarantorExternal_ORM_Entity,
      OtherExistLoansExternal_ORM_Entity,
      CollateralByBPJS_ORM_Entity,
      CollateralByBPKB_ORM_Entity,
      CollateralBySHM_ORM_Entity,
      CollateralByUMKM_ORM_Entity,
      CollateralByKedinasan_ORM_Entity,
      CollateralByKedinasan_Non_MOU_ORM_Entity,
    ]),

    //? untuk API Drafts agar bisa diinject ke roles:
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    ApprovalRecommendationModule,
  ],
  controllers: [
    // controllers
    MKT_GetDashboardStatsController,
    MKT_CreateDraftLoanApplicationController,
    MKT_CreateLoanApplicationController,
    MKT_GetAllLoanApplicationController,
    MKT_GetLoanApplicationByIdController,
    MKT_UpdateLoanApplicationController,
    MKT_TriggerAppealController,
    MKT_TriggerFinalLoanStatusController,
    MKT_GetClientDatabaseController,
    MKT_CreateRepeatOrderController,
    MKT_GetAllRepeatOrderHistoryController,
  ],
  providers: [
    // usecases
    MKT_GetDashboardStatsUseCase,
    MKT_CreateDraftLoanApplicationUseCase,
    MKT_CreateLoanApplicationUseCase,
    MKT_GetAllLoanApplicationUseCase,
    MKT_GetLoanApplicationByIdUseCase,
    MKT_UpdateLoanApplicationUseCase,
    MKT_TriggerAppealUseCase,
    MKT_TriggerFinalLoanStatusUseCase,
    MKT_GetClientsDatabaseUseCase,
    MKT_CreateRepeatOrderUseCase,
    MKT_GetAllRepeatOrderHistoryUseCase,
    // infra
    {
      provide: UNIT_OF_WORK,
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource) => new TypeOrmUnitOfWork(dataSource),
    },
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: MinioFileStorageService,
    },
  ],
  exports: [UNIT_OF_WORK, FILE_STORAGE_SERVICE], // biar bisa dipake module lain
})
export class MarketingExternalUseCaseModule {}
