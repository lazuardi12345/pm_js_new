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
import { HM_GetLoanApplicationByIdUseCase } from './Application/Services/HM_GetLoanApplicationById.usecase';
import { HM_GetAllApprovalRequestUseCase } from './Application/Services/HM_GetAllApprovalRequest.Usecase';
import { HM_GetAllApprovalHistoryUseCase } from './Application/Services/HM_GetApprovalHistory.usecase';
import { HM_ApproveOrRejectUseCase } from './Application/Services/HM_ApprovedOrReject.usecase';
import { HM_GetAllUsers_UseCase } from './Application/Services/HM_GetAllUsers.usecase';
import { HM_LoanAppealResponseUseCase } from './Application/Services/HM_LoanAppealResponse.usecase';

// Controllers
import { HM_GetLoanApplicationByIdController } from './Presentation/Controllers/HM_GetLoanApplicationById.controller';
import { HM_GetAllApprovalRequestController } from './Presentation/Controllers/HM_GetAllApprovalRequest.controller';
import { HM_GetApprovalHistoryController } from './Presentation/Controllers/HM_GetApprovalHistory.controller';
import { HM_ApprovedOrRejectController } from './Presentation/Controllers/HM_ApprovedOrReject.controller';
import { HM_GetAllUsers_Controller } from './Presentation/Controllers/HM_GetAllUsers.controller';
import { HM_LoanAppealResponseController } from './Presentation/Controllers/HM_LoanAppealResponse.controller';
import { ApprovalRecommendationModule } from 'src/Modules/Admin/BI-Checking/Modules/approval-recommendation.module';
import { DraftRepeatOrderModule } from 'src/Shared/Modules/Drafts/Modules/DraftRepeatOrder.module';
import { DraftLoanApplicationModule } from 'src/Shared/Modules/Drafts/Modules/CreateLoanAppInt.module';

@Module({
  imports: [
    ApprovalInternalModule,
    LoanApplicationInternalModule,
    UsersModule,
    TypeOrmModule.forFeature([
      ApprovalInternal_ORM_Entity,
      Users_ORM_Entity,
      LoanApplicationInternal_ORM_Entity,
    ]),
    DraftLoanApplicationModule,
    DraftRepeatOrderModule,
    ApprovalRecommendationModule,
  ],
  controllers: [
    HM_GetLoanApplicationByIdController,
    HM_GetAllApprovalRequestController,
    HM_GetApprovalHistoryController,
    HM_ApprovedOrRejectController,
    HM_GetAllUsers_Controller,
    HM_LoanAppealResponseController,
  ],
  providers: [
    HM_GetLoanApplicationByIdUseCase,
    HM_GetAllApprovalRequestUseCase,
    HM_GetAllApprovalHistoryUseCase,
    HM_ApproveOrRejectUseCase,
    HM_GetAllUsers_UseCase,
    HM_LoanAppealResponseUseCase,
    // {
    //   provide: LOAN_APPLICATION_INTERNAL_REPOSITORY,
    //   useClass: LoanApplicationInternalRepositoryImpl,
    // },
  ],
})
export class HeadMarketingInternalUsecaseModule {}
