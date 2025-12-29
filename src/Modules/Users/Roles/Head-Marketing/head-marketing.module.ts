import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApprovalInternalModule } from 'src/Modules/LoanAppInternal/Modules/approval-internal.module';
import { LoanApplicationInternalModule } from 'src/Modules/LoanAppInternal/Modules/loanApp-internal.module';
import { UsersModule } from '../../ModuleUsers.module';

import { ApprovalInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/approval-internal.orm-entity';
import { Users_ORM_Entity } from '../../Infrastructure/Entities/users.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';

import { LOAN_APPLICATION_INTERNAL_REPOSITORY } from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import { LoanApplicationInternalRepositoryImpl } from 'src/Modules/LoanAppInternal/Infrastructure/Repositories/loanApp-internal.repository.impl';

// Usecases
import { HM_GetLoanApplicationByIdInternalUseCase } from './Application/Services/Internal/HM_GetLoanApplicationById.usecase';
import { HM_GetAllApprovalRequestInternalUseCase } from './Application/Services/Internal/HM_GetAllApprovalRequest.Usecase';
import { HM_GetAllApprovalHistoryInternalUseCase } from './Application/Services/Internal/HM_GetApprovalHistory.usecase';
import { HM_ApproveOrRejectInternalUseCase } from './Application/Services/Internal/HM_ApprovedOrReject.usecase';
import { HM_GetAllUsers_UseCase } from './Application/Services/HM_GetAllUsers.usecase';
import { HM_LoanAppealResponseInternalUseCase } from './Application/Services/Internal/HM_LoanAppealResponse.usecase';
import { HM_ApproveOrRejectExternalUseCase } from './Application/Services/External/HM_ApprovedOrReject.usecase';

// Controllers
import { HM_GetLoanApplicationByIdInternalController } from './Presentation/Controllers/Internal/HM_GetLoanApplicationById.controller';
import { HM_GetAllApprovalRequestInternalController } from './Presentation/Controllers/Internal/HM_GetAllApprovalRequest.controller';
import { HM_GetApprovalHistoryInternalController } from './Presentation/Controllers/Internal/HM_GetApprovalHistory.controller';
import { HM_ApprovedOrRejectInternalController } from './Presentation/Controllers/Internal/HM_ApprovedOrReject.controller';
import { HM_GetAllUsers_Controller } from './Presentation/Controllers/HM_GetAllUsers.controller';
import { HM_LoanAppealResponseInternalController } from './Presentation/Controllers/Internal/HM_LoanAppealResponse.controller';
import { HM_ApprovedOrRejectExternalController } from './Presentation/Controllers/External/HM_ApprovedOrReject.controller';
import { ApprovalRecommendationModule } from 'src/Modules/Admin/BI-Checking/Modules/approval-recommendation.module';
import { DraftRepeatOrderModule } from 'src/Shared/Modules/Drafts/Modules/DraftRepeatOrder.module';
import { DraftLoanApplicationModule } from 'src/Shared/Modules/Drafts/Modules/CreateLoanAppInt.module';
import { ApprovalExternalModule } from 'src/Modules/LoanAppExternal/Modules/approval-external.module';
import { LoanApplicationExternalModule } from 'src/Modules/LoanAppExternal/Modules/loanApp-external.module';
import { HM_GetAllApprovalRequestExternalUseCase } from './Application/Services/External/HM_GetAllApprovalRequest.Usecase';
import { HM_GetAllApprovalRequestExternalController } from './Presentation/Controllers/External/HM_GetAllApprovalRequest.controller';
import { HM_GetApprovalHistoryExternalController } from './Presentation/Controllers/External/HM_GetApprovalHistory.controller';
import { HM_GetAllApprovalHistoryExternalUseCase } from './Application/Services/External/HM_GetApprovalHistory.usecase';
import { HM_GetLoanApplicationByIdExternalUseCase } from './Application/Services/External/HM_GetLoanApplicationById.usecase';
import { HM_GetLoanApplicationByIdExternalController } from './Presentation/Controllers/External/HM_GetLoanApplicationById.controller';
import { HM_LoanAppealResponseExternalController } from './Presentation/Controllers/External/HM_LoanAppealResponse.controller';
import { HM_LoanAppealResponseExternalUseCase } from './Application/Services/External/HM_LoanAppealResponse.usecase';

@Module({
  imports: [
    ApprovalInternalModule,
    ApprovalExternalModule,
    LoanApplicationInternalModule,
    LoanApplicationExternalModule,
    UsersModule,
    TypeOrmModule.forFeature([
      ApprovalInternal_ORM_Entity,
      ApprovalExternalModule,
      Users_ORM_Entity,
      LoanApplicationInternal_ORM_Entity,
      LoanApplicationExternalModule,
    ]),
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    ApprovalRecommendationModule,
  ],
  controllers: [
    //? INTERNAL
    HM_GetLoanApplicationByIdInternalController,
    HM_GetAllApprovalRequestInternalController,
    HM_GetApprovalHistoryInternalController,
    HM_ApprovedOrRejectInternalController,
    HM_LoanAppealResponseInternalController,

    //? EXTERNAL
    HM_ApprovedOrRejectExternalController,
    HM_GetAllApprovalRequestExternalController,
    HM_GetApprovalHistoryExternalController,
    HM_GetLoanApplicationByIdExternalController,
    HM_LoanAppealResponseExternalController,

    //? ALL
    HM_GetAllUsers_Controller,
  ],
  providers: [
    //? INTERNAL
    HM_GetLoanApplicationByIdInternalUseCase,
    HM_GetAllApprovalRequestInternalUseCase,
    HM_GetAllApprovalHistoryInternalUseCase,
    HM_ApproveOrRejectInternalUseCase,
    HM_LoanAppealResponseInternalUseCase,

    //? EXTERNAL
    HM_ApproveOrRejectExternalUseCase,
    HM_GetAllApprovalRequestExternalUseCase,
    HM_GetAllApprovalHistoryExternalUseCase,
    HM_GetLoanApplicationByIdExternalUseCase,
    HM_LoanAppealResponseExternalUseCase,

    //? ALL
    HM_GetAllUsers_UseCase,
    // {
    //   provide: LOAN_APPLICATION_INTERNAL_REPOSITORY,
    //   useClass: LoanApplicationInternalRepositoryImpl,
    // },
  ],
})
export class HeadMarketingUsecaseModule {}
