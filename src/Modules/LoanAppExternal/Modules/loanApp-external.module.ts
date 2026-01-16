// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplicationExternal_ORM_Entity } from '../Infrastructure/Entities/loan-application-external.orm-entity';
import { LoanApplicationExternalRepositoryImpl } from '../Infrastructure/Repositories/loanApp-external.repository.impl';
import { LOAN_APPLICATION_EXTERNAL_REPOSITORY } from '../Domain/Repositories/loanApp-external.repository';
import { LoanApplicationExternalService } from '../Application/Services/loanApp-external.service';
import { ApprovalRecommendation_ORM_Entity } from 'src/Modules/Admin/BI-Checking/Infrastructure/Entities/approval-recommendation.orm-entity';
import { APPROVAL_RECOMMENDATION_REPOSITORY } from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import { ApprovalRecommendationRepositoryImpl } from 'src/Modules/Admin/BI-Checking/Infrastructure/Repositories/approval-recommendation.repository.impl';
import { DraftsModule } from 'src/Shared/Modules/Drafts/ModuleDrafts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoanApplicationExternal_ORM_Entity,
      ApprovalRecommendation_ORM_Entity,
    ]),
    DraftsModule,
  ],
  providers: [
    LoanApplicationExternalService,
    {
      provide: LOAN_APPLICATION_EXTERNAL_REPOSITORY,
      useClass: LoanApplicationExternalRepositoryImpl,
    },
    {
      provide: APPROVAL_RECOMMENDATION_REPOSITORY,
      useClass: ApprovalRecommendationRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    LoanApplicationExternalService,
    LOAN_APPLICATION_EXTERNAL_REPOSITORY,
    APPROVAL_RECOMMENDATION_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class LoanApplicationExternalModule {}
