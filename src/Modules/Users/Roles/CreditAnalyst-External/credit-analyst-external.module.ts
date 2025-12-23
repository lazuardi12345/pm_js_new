// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entitas
import { ApprovalExternalModule } from 'src/Modules/LoanAppExternal/Modules/approval-external.module';
import { LoanApplicationExternalModule } from 'src/Modules/LoanAppExternal/Modules/loanApp-external.module';
import { UsersModule } from '../../ModuleUsers.module';

import { ApprovalInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/approval-internal.orm-entity';
import { Users_ORM_Entity } from '../../Infrastructure/Entities/users.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';

//? USE CASE
import { CA_ApproveOrRejectUseCase } from './Applications/Services/CA_ApprovedOrReject.usecase';
import { CA_GetApprovalHistory_UseCase } from './Applications/Services/CA_GetApprovalHistory.usecase';
import { CA_GetAllApprovalRequest_UseCase } from './Applications/Services/CA_GetAllApprovalRequest.usecase';
import { CA_GetLoanApplicationByIdUseCase } from './Applications/Services/CA_GetLoanApplicationById.usecase';
import { CA_GetDashboardStatsUseCase } from './Applications/Services/CA_GetDashboardStats.usecase';
import { CA_LoanAppealResponseUseCase } from './Applications/Services/CA_LoanAppealResponse.usecase';
//? CONTROLLER
import { CA_ApprovedOrRejectController } from './Presentation/Controllers/CA_ApprovedOrReject.controller';
import { CA_GetDashboardStatsController } from './Presentation/Controllers/CA_GetDashboardStats.controller';
import { CA_GetLoanApplicationByIdController } from './Presentation/Controllers/CA_GetLoanApplicationById.controller';
import { CA_GetAllApprovalRequest_Controller } from './Presentation/Controllers/CA_GetAlllAppprovalRequest.controller';
import { CA_GetApprovalHistory_Controller } from './Presentation/Controllers/CA_GetApprovalHistory.controller';
import { CA_LoanAppealResponseController } from './Presentation/Controllers/CA_LoanAppealResponse.controller';
import { DraftLoanApplicationModule } from 'src/Shared/Modules/Drafts/Modules/CreateLoanAppInt.module';
import { DraftRepeatOrderModule } from 'src/Shared/Modules/Drafts/Modules/DraftRepeatOrder.module';
import { ApprovalRecommendationModule } from 'src/Modules/Admin/BI-Checking/Modules/approval-recommendation.module';
import { CA_TriggerSurvey_UseCase } from './Applications/Services/CA_TriggerSurvey.usecase';
import { CA_TriggerSurveyController } from './Presentation/Controllers/CA_TriggerSurvey.controller';

@Module({
  imports: [
    ApprovalExternalModule,
    LoanApplicationExternalModule,
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
    CA_ApprovedOrRejectController,
    CA_GetDashboardStatsController,
    CA_GetApprovalHistory_Controller,
    CA_GetAllApprovalRequest_Controller,
    CA_GetLoanApplicationByIdController,
    CA_LoanAppealResponseController,
    CA_TriggerSurveyController,
  ],
  providers: [
    CA_ApproveOrRejectUseCase,
    CA_GetDashboardStatsUseCase,
    CA_GetAllApprovalRequest_UseCase,
    CA_GetApprovalHistory_UseCase,
    CA_GetLoanApplicationByIdUseCase,
    CA_LoanAppealResponseUseCase,
    CA_TriggerSurvey_UseCase,
  ],
})
export class CreditAnalystExternalUseCaseModule {}
