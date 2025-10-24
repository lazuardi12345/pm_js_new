// Modules/admin.module.ts
import { Module } from '@nestjs/common';
import { ApprovalRecommendationModule } from './Modules/approval-recommendation.module';

@Module({
  imports: [ApprovalRecommendationModule],
})
export class AdminBICheckingModule {}
