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
import { HM_GetTeamsUseCase } from './Application/Services/HM_GetTeams.Usecase';
import { HM_GetAllApprovalRequestByTeamUseCase } from './Application/Services/HM_GetAllApprovalRequestByTeam.Usecase';
import { HM_GetAllApprovalHistoryByTeamUseCase } from './Application/Services/HM_GetApprovalHistoryByTeam.usecase';
import { HM_ApproveOrRejectUseCase } from './Application/Services/HM_ApprovedOrReject.usecase';

// Controllers
import { HM_GetLoanApplicationByIdController } from './Infrastructure/Controllers/HM_GetLoanApplicationById.controller';
import { HM_GetAllApprovalRequestByTeamController } from './Infrastructure/Controllers/HM_GetAllApprovalRequestByTeam.controller';
import { HM_GetTeamsController } from './Infrastructure/Controllers/HM_GetTeams.contorller';
import { HM_GetApprovalHistoryByTeamController } from './Infrastructure/Controllers/HM_GetApprovalHistoryByTeam.controller';
import { HM_ApprovedOrRejectController } from './Infrastructure/Controllers/HM_ApprovedOrReject.controller';

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
  ],
  controllers: [
    HM_GetLoanApplicationByIdController,
    HM_GetAllApprovalRequestByTeamController,
    HM_GetTeamsController,
    HM_GetApprovalHistoryByTeamController,
    HM_ApprovedOrRejectController,
  ],
  providers: [
    HM_GetLoanApplicationByIdUseCase,
    HM_GetAllApprovalRequestByTeamUseCase,
    HM_GetTeamsUseCase,
    HM_GetAllApprovalHistoryByTeamUseCase,
    HM_ApproveOrRejectUseCase,
    {
      provide: LOAN_APPLICATION_INTERNAL_REPOSITORY,
      useClass: LoanApplicationInternalRepositoryImpl,
    },
  ],
})
export class HeadMarketingInternalUsecaseModule {}
