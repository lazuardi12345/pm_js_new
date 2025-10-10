// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyPhotos_ORM_Entity } from '../Infrastructure/Entities/survey-photos.orm-entity';
import { SurveyPhotosRepositoryImpl } from '../Infrastructure/Repositories/survey-photos-external.repository.impl';
import { SURVEY_PHOTOS_EXTERNAL_REPOSITORY } from '../Domain/Repositories/survey-photos-external.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyPhotos_ORM_Entity])],
  providers: [
    {
      provide: SURVEY_PHOTOS_EXTERNAL_REPOSITORY,
      useClass: SurveyPhotosRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    SURVEY_PHOTOS_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class SurveyPhotos_External_Module {}
