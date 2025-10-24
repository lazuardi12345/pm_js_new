// Domain/Entities/approval-recommendation.entity.ts

import { RecommendationEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';

export class ApprovalRecommendation {
  constructor(
    public recommendation: RecommendationEnum,
    public filePath: string,

    public readonly id?: number,
    public readonly draft_id?: string, // char(24) from Mongo
    public readonly nik?: string, // char(16) for NIK
    public readonly loan_application_internal_id?: number,
    public readonly loan_application_external_id?: number,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    public updated_at?: Date,
  ) {}
}
