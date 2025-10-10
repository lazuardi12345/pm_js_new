// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyReports_ORM_Entity } from '../Infrastructure/Entities/survey-reports.orm-entity';
import { SurveyReportsRepositoryImpl } from '../Infrastructure/Repositories/survey-reports-external.repository.impl';
import { SURVEY_REPORTS_EXTERNAL_REPOSITORY } from '../Domain/Repositories/survey-reports-external.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyReports_ORM_Entity])],
  providers: [
    {
      provide: SURVEY_REPORTS_EXTERNAL_REPOSITORY,
      useClass: SurveyReportsRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    SURVEY_REPORTS_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class SurveyReports_External_Module {}
