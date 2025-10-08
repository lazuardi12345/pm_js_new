import { Injectable, Inject } from '@nestjs/common';
import {
  ISurveyPhotosRepository,
  SURVEY_PHOTOS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/survey-photos-external.repository';
import { SurveyPhotos } from '../../Domain/Entities/survey-photos-external.entity';
import { CreateSurveyPhotosDto } from '../DTOS/dto-Survey-Photos/create-survey-photos.dto';
import { UpdateSurveyPhotosDto } from '../DTOS/dto-Survey-Photos/update-survey-photos.dto';
export class EmergencyContactExternalService {
  constructor(
    @Inject(SURVEY_PHOTOS_EXTERNAL_REPOSITORY)
    private readonly repo: ISurveyPhotosRepository,
  ) {}

  async create(dto: CreateSurveyPhotosDto): Promise<SurveyPhotos> {
    const now = new Date();

    const address = new SurveyPhotos(
      dto.hasil_survey_id, // hasilSurveyId
      undefined,
      dto.foto_survey, // fotoSurvey (optional)
      now, // createdAt
      now, // updatedAt
      undefined,
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateSurveyPhotosDto): Promise<SurveyPhotos> {
    const partial: Partial<SurveyPhotos> = {
      hasilSurveyId: dto.hasOwnProperty('hasil_survey_id')
        ? dto.hasil_survey_id
        : undefined,
      fotoSurvey: dto.foto_survey,
      updatedAt: new Date(),
    };
    return this.repo.update(id, partial);
  }

  async findById(id: number): Promise<SurveyPhotos | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<SurveyPhotos[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
