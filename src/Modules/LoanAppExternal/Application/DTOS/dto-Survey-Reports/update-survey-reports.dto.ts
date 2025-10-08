import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyReportsDto } from './create-survey-reports.dto';

export class UpdateSurveyReportsDto extends PartialType(
  CreateSurveyReportsDto,
) {}
