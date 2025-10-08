import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSurveyPhotosDto {
  @IsNumber()
  hasil_survey_id: number;

  @IsOptional()
  @IsString()
  foto_survey?: string;
}
