import { PartialType } from '@nestjs/mapped-types';
import { CreateApprovalRecommendationDto } from './create-approval-recommendation.dto';

export class UpdateApprovalRecommendationDto extends PartialType(
  CreateApprovalRecommendationDto,
) {}
