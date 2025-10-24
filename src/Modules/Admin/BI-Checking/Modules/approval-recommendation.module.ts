// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRecommendation_ORM_Entity } from '../Infrastructure/Entities/approval-recommendation.orm-entity';
import { ApprovalRecommendationRepositoryImpl } from '../Infrastructure/Repositories/approval-recommendation.repository.impl';
import { APPROVAL_RECOMMENDATION_REPOSITORY } from '../Domain/Repositories/approval-recommendation.repository';
import { ApprovalRecommendationService } from '../Applications/Services/approval-recommendation.entity';
import { ApprovalRecommendationController } from '../Presentation/Controllers/approval-recommendation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalRecommendation_ORM_Entity])],
  controllers: [ApprovalRecommendationController],
  providers: [
    {
      provide: APPROVAL_RECOMMENDATION_REPOSITORY,
      useClass: ApprovalRecommendationRepositoryImpl,
    },
    ApprovalRecommendationService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    APPROVAL_RECOMMENDATION_REPOSITORY,
    ApprovalRecommendationService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class ApprovalRecommendationModule {}
