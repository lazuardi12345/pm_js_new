// Domain/Repositories/approval-external.repository.ts
import { SurveyPhotos } from "../Entities/survey-photos-external.entity";

export const SURVEY_PHOTOS_EXTERNAL_REPOSITORY = ' SURVEY_PHOTOS_EXTERNAL_REPOSITORY';

export interface ISurveyPhotosRepository {
  findById(id: number): Promise<SurveyPhotos | null>;
  findByHasilSurveyId(hasilSurveyId: number): Promise<SurveyPhotos[]>;
  findAll(): Promise<SurveyPhotos[]>;
  save(address: SurveyPhotos): Promise<SurveyPhotos>;
  update(
    id: number,
    address: Partial<SurveyPhotos>,
  ): Promise<SurveyPhotos>;
  delete(id: number): Promise<void>;
}
