import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { INotificationLoanApplicationRepository, NOTIFICATION_LOAN_APPLICATION_REPOSITORY } from '../../Domain/Repositories/Notif_LoanApp.repository';
import { CreateNotificationDto } from '../DTOS/LoanAppInternal/NotifLoanAppInternal.dto';

@Injectable()
export class CreateNotifLoanApplicationUseCase {
  constructor(
    @Inject(NOTIFICATION_LOAN_APPLICATION_REPOSITORY)
    private readonly notifLoanAppRepo: INotificationLoanApplicationRepository,
  ) {}

  async executeCreateNotif(marketingId: number, dto: CreateNotificationDto) {
    try {
      const notifLoanApp = await this.notifLoanAppRepo.create({
        user_id: marketingId,
        loan_app_id: dto.loan_app_id,
        message: dto.message,
        isRead: dto.isRead,
      });

      return {
        error: false,
        message: 'Draft loan application created',
        reference: 'LOAN_CREATE_OK',
        data: notifLoanApp,
      };
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new HttpException(
          {
            error: true,
            message: Object.values(err.errors)
              .map((e: any) => e.message)
              .join(', '),
            reference: 'LOAN_VALIDATION_ERROR',
          },
          HttpStatus.BAD_REQUEST, // ⬅️ 400 bukan 201
        );
      }

      if (err.code === 11000) {
        throw new HttpException(
          {
            error: true,
            message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
            reference: 'LOAN_DUPLICATE_KEY',
          },
          HttpStatus.CONFLICT, // ⬅️ 409 untuk duplicate
        );
      }

      throw new HttpException(
        {
          error: true,
          message: err.message || 'Unexpected error',
          reference: 'LOAN_UNKNOWN_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async renderDraftByMarketingId(marketingId: number) {
    try {
      const loanApps =
        await this.notifLoanAppRepo.findByMarketingId(marketingId);
      if (loanApps.length === 0) {
        return {
          error: true,
          message: 'No draft loan applications found for this marketing ID',
          reference: 'LOAN_NOT_FOUND',
          data: [],
        };
      }
      return {
        error: false,
        message: 'Draft loan applications retrieved',
        reference: 'LOAN_RETRIEVE_OK',
        data: loanApps,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || 'Unexpected error',
        reference: 'LOAN_UNKNOWN_ERROR',
      };
    }
  }

  //   async deleteDraftByMarketingId(Id: string) {
  //     try {
  //       await this.notifLoanAppRepo.softDelete(Id);
  //       return {
  //         error: false,
  //         message: 'Draft loan applications deleted',
  //         reference: 'LOAN_DELETE_OK',
  //       };
  //     } catch (error) {
  //       return {
  //         error: true,
  //         message: error.message || 'Unexpected error',
  //         reference: 'LOAN_UNKNOWN_ERROR',
  //       };
  //     }
  //   }

  async updateDraftById(
    Id: string,
    updateData: Partial<CreateNotificationDto>,
  ) {
    try {
      const loanApp = await this.notifLoanAppRepo.patchUpdateNotificationById(
        Id,
        updateData,
      );
      return {
        error: false,
        message: 'Draft loan applications updated',
        reference: 'LOAN_UPDATE_OK',
        data: loanApp,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message || 'Unexpected error',
        reference: 'LOAN_UNKNOWN_ERROR',
      };
    }
  }
}
