// Domain/Repositories/IApprovalRecommendationRepository.ts

import { ApprovalRecommendation } from '../Entities/approval-recommendation.entity';

export const APPROVAL_RECOMMENDATION_REPOSITORY = Symbol(
  'APPROVAL_RECOMMENDATION_REPOSITORY',
);

export interface IApprovalRecommendationRepository {
  create(entity: ApprovalRecommendation): Promise<ApprovalRecommendation>;
  update(
    id: number,
    entity: Partial<ApprovalRecommendation>,
  ): Promise<ApprovalRecommendation>;
  findAllRecommendationHistory(): Promise<ApprovalRecommendation[]>;
  findById(id: number): Promise<ApprovalRecommendation | null>;
  findByDraftId(draft_id: string): Promise<ApprovalRecommendation | null>;
  findByNIK(nik: string): Promise<ApprovalRecommendation | null>;
  delete(id: number): Promise<void>;
}
