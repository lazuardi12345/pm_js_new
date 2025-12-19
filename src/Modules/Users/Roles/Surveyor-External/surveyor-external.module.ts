// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';

// Import entitas
import { LoanApplicationExternalModule } from 'src/Modules/LoanAppExternal/Modules/loanApp-external.module';
import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';

//? USE CASE
import { SVY_GetAllUnscheduledSurveyListUseCase } from './Applications/Services/SVY_GetAllUnscheduledSurveyList.usecase';
import { SVY_GetAllScheduledSurveyListUseCase } from './Applications/Services/SVY_GetAllScheduledSurveyList.usecase';
import { SVY_SetSurveySchedule_UseCase } from './Applications/Services/SVY_SetSurveySchedule.usecase';
import { SVY_CreateSurveyReportUseCase } from './Applications/Services/SVY_CreateSurveyResult.usecase';

//? CONTROLLER
import { SVY_GetAllUnscheduledSurveyListController } from './Presentation/Controllers/SVY_GetAllUnscheduledSurveyList.controller';
import { SVY_GetAllScheduledSurveyListController } from './Presentation/Controllers/SVY_GetAllScheduledSurveyList.controller';
import { SVY_SetSurveyScheduleController } from './Presentation/Controllers/SVY_SetSurveyList.controller';
import { SVY_CreateSurveyReportController } from './Presentation/Controllers/SVY_CreateSurveyResult.controller';
import { UNIT_OF_WORK } from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { DataSource } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/Modules/LoanAppInternal/Infrastructure/Repositories/UnitOfWork.repository.impl';
import { FILE_STORAGE_SERVICE } from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import { MinioFileStorageService } from 'src/Shared/Modules/Storage/Infrastructure/Service/ObjectStorageServer.service';
import { ClientExternalModule } from 'src/Modules/LoanAppExternal/Modules/client-external.module';
import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
import { SVY_GetClientDetailForSurveyPurposeController } from './Presentation/Controllers/SVY_GetClientDetailForSurveyPurpose.controller';
import { SVY_GetClientDetailForSurveyPurposeUseCase } from './Applications/Services/SVY_GetClientDetailForSurveyPurpose.usecase';
@Module({
  imports: [
    LoanApplicationExternalModule,
    ClientExternalModule,
    TypeOrmModule.forFeature([
      LoanApplicationInternal_ORM_Entity,
      ClientExternal_ORM_Entity,
    ]),
  ],
  controllers: [
    SVY_GetAllUnscheduledSurveyListController,
    SVY_SetSurveyScheduleController,
    SVY_GetAllScheduledSurveyListController,
    SVY_CreateSurveyReportController,
    SVY_GetClientDetailForSurveyPurposeController,
  ],
  providers: [
    {
      provide: UNIT_OF_WORK,
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource) => new TypeOrmUnitOfWork(dataSource),
    },
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: MinioFileStorageService,
    },
    SVY_GetAllUnscheduledSurveyListUseCase,
    SVY_SetSurveySchedule_UseCase,
    SVY_GetAllScheduledSurveyListUseCase,
    SVY_CreateSurveyReportUseCase,
    SVY_GetClientDetailForSurveyPurposeUseCase,
  ],
})
export class SurveyorExternalUseCaseModule {}
