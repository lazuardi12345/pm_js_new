import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyPhotosDto } from './create-survey-photos.dto';

export class UpdateSurveyPhotosDto extends PartialType(CreateSurveyPhotosDto) {}
