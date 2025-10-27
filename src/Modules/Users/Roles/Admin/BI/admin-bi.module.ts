// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entitas
import { ApprovalRecommendationModule } from 'src/Modules/Admin/BI-Checking/Modules/approval-recommendation.module';

//? USE CASE
import { AdBIC_CreateApprovalResponseUseCase } from './Applications/AdBIC_CreateApprovalResponse.usecase';
//? CONTROLLER;
import { AdBIC_CreateApprovalResponseController } from './Presentation/AdBIC_CreateApprovalResponse.controller';
import { FileSystemStorageModules } from 'src/Shared/Modules/Storage/ModuleStorage.module';
import { AdBIC_FindAllRecommendationHistoryController } from './Presentation/AdBIC_GetAllApprovalRecommendation.controller';
import { AdBIC_FindAllRecommendationHistoryUseCase } from './Applications/AdBIC_GetAllApprovalRecommendation.usecase';

@Module({
  imports: [
    FileSystemStorageModules,
    ApprovalRecommendationModule,
    TypeOrmModule.forFeature([ApprovalRecommendationModule]),
  ],
  controllers: [
    AdBIC_CreateApprovalResponseController,
    AdBIC_FindAllRecommendationHistoryController,
  ],
  providers: [
    AdBIC_CreateApprovalResponseUseCase,
    AdBIC_FindAllRecommendationHistoryUseCase,
  ],
})
export class AdminBICheckingUseCaseModule {}
