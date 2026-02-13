import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {
  FILE_STORAGE_SERVICE,
  FileMetadata,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import sharp from 'sharp';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import { ApprovalRecommendation } from 'src/Modules/Admin/BI-Checking/Domain/Entities/approval-recommendation.entity';
import { AdBIC_CreatePayloadDto } from './DTOS/AdBIC_CreatePayload.dto';
import { LoanTypeEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';
import { NotificationClientService } from 'src/Shared/Modules/Notifications/Infrastructure/Services/notification.service';

@Injectable()
export class AdBIC_CreateApprovalResponseUseCase {
  constructor(
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendation: IApprovalRecommendationRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,

    private readonly notificationClient: NotificationClientService,
  ) {}

  async executeCreateDraft(
    dto: AdBIC_CreatePayloadDto,
    files?: Record<string, Express.Multer.File[]>,
    type?: LoanTypeEnum,
    token?: string,
  ) {
    try {
      let filePaths: Record<string, FileMetadata[]> = {};

      if (files && Object.keys(files).length > 0) {
        for (const fileArray of Object.values(files)) {
          for (const file of fileArray) {
            if (file.mimetype.startsWith('image/')) {
              const outputBuffer = await sharp(file.buffer)
                .jpeg({ quality: 100 })
                .toBuffer();

              file.buffer = outputBuffer;
              file.originalname = file.originalname.replace(/\.\w+$/, '.jpeg');
            }
          }
        }

        if (!dto?.nik && !dto?.no_ktp) {
          throw new BadRequestException('NIK or No KTP required');
        } else if (!dto?.nama_lengkap && !dto?.nama_nasabah) {
          throw new BadRequestException('Customer Name required');
        }

        filePaths = await this.fileStorage.saveApprovalRecommedationFiles(
          String(dto?.nik ?? dto?.no_ktp),
          String(dto?.nama_lengkap ?? dto?.nama_nasabah),
          files,
        );

        const firstField = Object.keys(filePaths)[0];
        const firstFile = filePaths[firstField]?.[0];

        if (firstFile) {
          dto.filePath = firstFile.url;
        }
        const entity = new ApprovalRecommendation(
          dto.recommendation,
          dto.filePath,
          dto.nominal_pinjaman,
          undefined,
          dto?.draft_id,
          String(dto?.nik ?? dto?.no_ktp),
          dto.no_telp,
          dto?.email,
          dto?.nama_nasabah ?? dto?.nama_lengkap,
          dto?.catatan,
          type,
          new Date(),
          null,
          new Date(),
        );

        const loanApp = await this.approvalRecommendation.create(entity);

        if (!loanApp) {
          throw new HttpException(
            {
              payload: {
                error: 'CREATION FAILED',
                message: 'Failed to create approval recommendation',
                reference: 'APPROVAL_RECOMMENDATION_CREATE_FAILED',
              },
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const findMarketingId =
          await this.approvalRecommendation.findAllAcrossDataDraftById(
            dto.draft_id! ?? undefined,
          );

        const marketingId = findMarketingId.marketing_id.toString();
        const draftId = findMarketingId._id.toString();
        this.notificationClient.sendAdminBIApprovalNotification(
          { marketingId, draftId },
          token,
        );

        return {
          dto: {
            error: false,
            message: 'Draft loan application created',
            reference: 'APPROVAL_RECOMMENDATION_CREATE_OK',
            data: loanApp,
          },
        };
      }
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
              reference: 'APPROVAL_RECOMMENDATION_VALIDATION_ERROR',
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
            reference: 'AROVAL_RECOMMENDATION_DUPLICATE_KEY',
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
            reference: 'AROVAL_RECOMMENDATION_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
