import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entitas
import { ApprovalInternalModule } from 'src/Modules/LoanAppInternal/Modules/approval-internal.module';
import { LoanApplicationInternalModule } from 'src/Modules/LoanAppInternal/Modules/loanApp-internal.module';
import { UsersModule } from '../../ModuleUsers.module';

import { ApprovalInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/approval-internal.orm-entity';
import { Users_ORM_Entity } from '../../Infrastructure/Entities/users.orm-entity';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';


//Usecase

import { HM_GetLoanApplicationByIdUseCase } from './Application/Services/HM_GetLoanApplicationById.usecase';
import { HM_GetAllApprovalRequestByTeam_UseCase } from './Application/Services/HM_GetAllApprovalRequestByTeam.Usecase';
import { HM_GetTeamsUseCase } from './Application/Services/HM_GetTeams.Usecase';



//Controller
import { HM_GetLoanApplicationByIdController } from './Infrastructure/Controllers/HM_GetLoanApplicationById.controller';
import { HM_GetAllApprovalRequestByTeamController } from './Infrastructure/Controllers/HM_GetAllApprovalRequestByTeam.controller';
import { HM_GetTeamsController } from './Infrastructure/Controllers/HM_GetTeams.contorller';

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
    ],

    providers: [
        HM_GetLoanApplicationByIdUseCase,
        HM_GetAllApprovalRequestByTeam_UseCase,
        HM_GetTeamsUseCase
    ]
})

export class HeadMarkertingInternalUsecaseModel {}