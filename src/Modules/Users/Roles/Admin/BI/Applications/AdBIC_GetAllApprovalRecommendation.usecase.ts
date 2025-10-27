import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';

@Injectable()
export class AdBIC_FindAllRecommendationHistoryUseCase {
  constructor(
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendation: IApprovalRecommendationRepository,
  ) {}

  async executeFindAllRecommendationHistory() {
    try {
      const histories =
        await this.approvalRecommendation.findAllRecommendationHistory();
      return {
        payload: {
          error: false,
          message: 'Success get recommendation history',
          reference: 'APPROVAL_RECOMMENDATION_HISTORY_OK',
          data: histories,
        },
      };
    } catch (err) {
      console.log(err);

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        throw new HttpException(
          {
            payload: {
              error: 'BAD REQUEST',
              message: Object.values(err.errors)
                .map((e: any) => e.message)
                .join(', '),
              reference: 'APPROVAL_RECOMMENDATION_HISTORY_VALIDATION_ERROR',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Duplicate key error
      if (err.code === 11000) {
        throw new HttpException(
          {
            error: 'DUPLICATE KEY',
            message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
            reference: 'APPROVAL_RECOMMENDATION_HISTORY_DUPLICATE_KEY',
          },
          HttpStatus.CONFLICT,
        );
      }

      // fallback error
      throw new HttpException(
        {
          payload: {
            error: 'UNEXPECTED ERROR',
            message: 'Unexpected error',
            reference: 'APPROVAL_RECOMMENDATION_HISTORY_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
