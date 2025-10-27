import { Injectable, Inject } from '@nestjs/common';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from '../../Domain/Repositories/approval-recommendation.repository';
import { ApprovalRecommendation } from '../../Domain/Entities/approval-recommendation.entity';
import { CreateApprovalRecommendationDto } from '../DTOS/dto-ApprovalRecommendation/create-approval-recommendation.dto';
import { UpdateApprovalRecommendationDto } from '../DTOS/dto-ApprovalRecommendation/update-approval-recommendation.dto';

@Injectable()
export class ApprovalRecommendationService {
  constructor(
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendationRepository: IApprovalRecommendationRepository,
  ) {}

  async create(
    dto: CreateApprovalRecommendationDto,
  ): Promise<ApprovalRecommendation> {
    const now = new Date();
    const address = new ApprovalRecommendation(
      dto.recommendation,
      dto.filePath,
      undefined,
      dto.draft_id,
      dto.nik,
      dto.no_telp,
      dto.email,
      dto.nama_nasabah,
      dto.loan_application_internal_id,
      dto.loan_application_external_id,
      now,
      null,
    );
    return this.approvalRecommendationRepository.create(address);
  }

  async update(
    id: number,
    dto: UpdateApprovalRecommendationDto,
  ): Promise<ApprovalRecommendation> {
    return this.approvalRecommendationRepository.update(id, dto);
  }

  async findById(id: number): Promise<ApprovalRecommendation | null> {
    return this.approvalRecommendationRepository.findById(id);
  }

  async findByDraftId(
    draft_id: string,
  ): Promise<ApprovalRecommendation | null> {
    return this.approvalRecommendationRepository.findByDraftId(draft_id);
  }

  async findByNIK(nik: string): Promise<ApprovalRecommendation | null> {
    return this.approvalRecommendationRepository.findByNIK(nik);
  }

  async delete(id: number): Promise<void> {
    return this.approvalRecommendationRepository.delete(id);
  }
}
