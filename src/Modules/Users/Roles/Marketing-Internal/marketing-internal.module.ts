// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';

// ORM entities
import { ClientInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/client-internal.orm-entity';
import { AddressInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/address-internal.orm-entity';
import { FamilyInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/family-internal.orm-entity';
import { JobInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/job-internal.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';
import { CollateralInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/collateral-internal.orm-entity';
import { RelativeInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/relative-internal.orm-entity';

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

import { AddressInternalModule } from 'src/Modules/LoanAppInternal/Modules/address-internal.module';
import { ApprovalInternalModule } from 'src/Modules/LoanAppInternal/Modules/approval-internal.module';
import { ClientInternalModule } from 'src/Modules/LoanAppInternal/Modules/client-internal.module';
import { CollateralInternalModule } from 'src/Modules/LoanAppInternal/Modules/collateral-internal.module';
import { JobInternalModule } from 'src/Modules/LoanAppInternal/Modules/job-internal.module';
import { FamilyInternalModule } from 'src/Modules/LoanAppInternal/Modules/family-internal.module';
import { LoanApplicationInternalModule } from 'src/Modules/LoanAppInternal/Modules/loanApp-internal.module';
import { RelativeInternalModule } from 'src/Modules/LoanAppInternal/Modules/relative-internal.module';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';

import { DraftLoanApplicationModule } from 'src/Shared/Modules/Drafts/Modules/CreateLoanAppInt.module';
import { ClientInternalProfileModule } from 'src/Modules/LoanAppInternal/Modules/client-internal-profile.module';
import { ClientInternalProfile_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/client-internal-profile.orm-entity';

@Module({
  imports: [
    HttpModule,
    AddressInternalModule,
    ApprovalInternalModule,
    ClientInternalModule,
    ClientInternalProfileModule,
    CollateralInternalModule,
    JobInternalModule,
    FamilyInternalModule,
    LoanApplicationInternalModule,
    RelativeInternalModule,
    TypeOrmModule.forFeature([
      ClientInternal_ORM_Entity,
      ClientInternalProfile_ORM_Entity,
      AddressInternal_ORM_Entity,
      FamilyInternal_ORM_Entity,
      JobInternal_ORM_Entity,
      LoanApplicationInternal_ORM_Entity,
      CollateralInternal_ORM_Entity,
      RelativeInternal_ORM_Entity,
    ]),

    //? untuk API Drafts agar bisa diinject ke roles:
    DraftLoanApplicationModule,
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
export class MarketingInternalUseCaseModule {}
