import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY,
  ILoanApplicationDraftInternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/int/LoanAppInt.repository';
import {
  CreateDraftLoanApplicationIntDto,
  PayloadDTO,
} from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppInt_MarketingInput/CreateDraft_LoanAppInt.dto';
import { LoanApplicationEntity } from 'src/Shared/Modules/Drafts/Domain/Entities/int/LoanAppInt.entity';
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
import { MKT_GetDraftByMarketingId_ApprovalRecommendation } from 'src/Shared/Interface/MKT_GetDraft/MKT_GetDraftByMarketingId.interface';
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';
import {
  CLIENT_INTERNAL_REPOSITORY,
  IClientInternalRepository,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/client-internal.repository';

@Injectable()
export class MKT_CreateDraftLoanApplicationUseCase {
  constructor(
    @Inject(DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftInternalRepository,
    @Inject(CLIENT_INTERNAL_REPOSITORY)
    private readonly clientRepo: IClientInternalRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendationRepo: IApprovalRecommendationRepository,
  ) {}

  async executeCreateDraft(
    dto: PayloadDTO,
    files?: Record<string, Express.Multer.File[]>,
  ) {
    try {
      const duplicateChecker = await this.clientRepo.findByKtp(
        dto.client_internal.no_ktp,
      );

      console.log('kontol dupli check', duplicateChecker);

      if (duplicateChecker) {
        throw new HttpException(
          'This Client National Identity Number already registered',
          HttpStatus.FORBIDDEN,
        );
      }
      let filePaths: Record<string, FileMetadata[]> = {};

      // Proses file kalau ada
      if (files && Object.keys(files).length > 0) {
        for (const [field, fileArray] of Object.entries(files)) {
          for (const file of fileArray) {
            // convert gambar ke JPEG tanpa resize
            if (file.mimetype.startsWith('image/')) {
              const outputBuffer = await sharp(file.buffer)
                .jpeg({ quality: 100 })
                .toBuffer();

              file.buffer = outputBuffer;
              file.originalname = file.originalname.replace(/\.\w+$/, '.jpeg');
            }
          }
        }

        // simpan file ke storage
        filePaths = await this.fileStorage.saveFiles(
          Number(dto?.client_internal?.no_ktp) ?? dto.client_internal.no_ktp,
          dto?.client_internal?.nama_lengkap ??
            `draft-${dto.client_internal.no_ktp}`,
          files,
          REQUEST_TYPE.INTERNAL,
        );

        // Assign hasil upload ke DTO sesuai field
        for (const [field, paths] of Object.entries(filePaths)) {
          if (paths && paths.length > 0) {
            dto.client_internal[field] = paths[0].url;
          }
        }
      }

      // 3️⃣ Simpan draft loan application
      const loanApp = await this.loanAppDraftRepo.create({
        ...dto,
        uploaded_files: filePaths,
      });

      if (!loanApp) {
        throw new Error('Failed to Create Draft');
      } else {
        await this.loanAppDraftRepo.triggerIsNeedCheckBeingTrue(
          loanApp._id?.toString(),
          Number(dto.loan_application_internal?.nominal_pinjaman),
        );
      }

      return {
        dto: {
          error: false,
          message: 'Draft loan application created',
          reference: 'LOAN_CREATE_OK',
          data: loanApp,
        },
      };
    } catch (err) {
      if (
        err instanceof HttpException ||
        typeof err.getStatus === 'function' ||
        typeof err.status === 'number'
      ) {
        throw err;
      }

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        throw new HttpException(
          {
            payload: {
              error: 'BAD REQUEST',
              message: Object.values(err.errors)
                .map((e: any) => e.message)
                .join(', '),
              reference: 'LOAN_VALIDATION_ERROR',
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
            reference: 'LOAN_DUPLICATE_KEY',
          },
          HttpStatus.CONFLICT,
        );
      }

      // fallback error
      throw new HttpException(
        {
          payload: {
            error: 'UNEXPECTED ERROR',
            message: err?.message || 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDraftById(
    Id: string,
    updateData: Partial<CreateDraftLoanApplicationIntDto>,
    files?: Record<string, Express.Multer.File[]>,
  ) {
    const { payload } = updateData;

    if (!payload) {
      throw new BadRequestException('Payload is required');
    }

    try {
      let filePaths: Record<string, FileMetadata[]> = {};

      if (files && Object.keys(files).length > 0) {
        // Convert gambar ke JPEG tanpa resize
        for (const [field, fileArray] of Object.entries(files)) {
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

        filePaths = await this.fileStorage.saveFiles(
          Number(payload?.client_internal?.no_ktp) ?? Id,
          payload?.client_internal?.nama_lengkap ?? `draft-${Id}`,
          files,
          REQUEST_TYPE.INTERNAL,
        );

        for (const [field, paths] of Object.entries(filePaths)) {
          if (paths && paths.length > 0) {
            // Tentukan di object mana field ini berada
            const parentKeys = [
              'client_internal',
              'job_internal',
              'collateral_internal',
              'relative_internal',
            ];
            let assigned = false;

            for (const key of parentKeys) {
              if (payload[key] && field in payload[key]) {
                payload[key][field] = paths[0].url; // assign URL string
                assigned = true;
                break;
              }
            }

            if (!assigned) {
              // fallback: assign di root payload
              payload[field] = paths[0].url;
            }
          }
        }
      }

      console.log('File paths:', filePaths);
      console.log('Payload (update):', payload);

      const existingDraft = await this.loanAppDraftRepo.findById(Id);

      if (!existingDraft) {
        throw new NotFoundException(`Draft with id ${Id} not found`);
      }

      // HAPUS file lama dengan field name yang sama (base name tanpa ekstensi)
      const existingFiles = { ...(existingDraft.uploaded_files || {}) };

      // Helper function untuk dapat base name (tanpa ekstensi)
      const getBaseName = (fieldName: string): string => {
        // Hapus ekstensi: foto_kk.jpeg.enc → foto_kk
        return fieldName.split('.')[0];
      };

      // Hapus file lama yang field name-nya sama dengan file baru
      for (const newFieldName of Object.keys(filePaths)) {
        const newBaseName = getBaseName(newFieldName);

        // Cari dan hapus semua file lama dengan base name yang sama
        for (const existingFieldName of Object.keys(existingFiles)) {
          const existingBaseName = getBaseName(existingFieldName);

          if (existingBaseName === newBaseName) {
            console.log(
              `* Removing old file: ${existingFieldName} (replaced by ${newFieldName})`,
            );
            delete existingFiles[existingFieldName];
          }
        }
      }

      const mergedFiles = {
        ...existingFiles, // ← File lama yang sudah di-cleanup
        ...filePaths, // ← File baru
      };

      console.log('Old files (after cleanup):', existingFiles);
      console.log('New files:', filePaths);
      console.log('Merged files:', mergedFiles);

      const entityUpdate: Partial<LoanApplicationEntity> = {
        ...payload,
        uploaded_files: mergedFiles,
      };

      const loanApp = await this.loanAppDraftRepo.updateDraftById(
        Id,
        entityUpdate,
      );

      const verifyAfterUpdate = await this.loanAppDraftRepo.findById(Id);

      return {
        payload: {
          error: false,
          message: 'Draft loan application updated',
          reference: 'LOAN_UPDATE_OK',
          data: verifyAfterUpdate,
        },
      };
    } catch (err) {
      console.error('Update error:', err);

      // Re-throw HttpException (termasuk NotFoundException)
      if (err instanceof HttpException) {
        throw err;
      }

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        throw new HttpException(
          {
            payload: {
              error: 'BAD REQUEST',
              message: Object.values(err.errors)
                .map((e: any) => e.message)
                .join(', '),
              reference: 'LOAN_VALIDATION_ERROR',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Duplicate key error
      if (err.code === 11000) {
        throw new HttpException(
          {
            payload: {
              error: 'DUPLICATE KEY',
              message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
              reference: 'LOAN_DUPLICATE_KEY',
            },
          },
          HttpStatus.CONFLICT,
        );
      }

      // Fallback error
      throw new HttpException(
        {
          payload: {
            error: true,
            message: 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async renderDraftById(Id: string) {
    try {
      const loanApp = await this.loanAppDraftRepo.findById(Id);

      if (!loanApp) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'No draft loan applications found for this ID',
              reference: 'LOAN_NOT_FOUND',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        error: false,
        message: 'Draft loan applications retrieved',
        reference: 'LOAN_RETRIEVE_OK',
        data: {
          client_and_loan_detail: {
            ...loanApp,
          },
        },
      };
    } catch (error) {
      console.error('renderDraftById Error:', error);

      // Tetap lempar kalau emang HttpException bawaan
      if (error instanceof HttpException) {
        throw error;
      }

      // Deteksi error DB (Prisma, TypeORM, Mongoose dsb)
      if (error.code === 'ECONNREFUSED' || error.name === 'MongoNetworkError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database connection error',
              reference: 'DB_CONNECTION_ERROR',
            },
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (error.code === 'ER_NO_SUCH_TABLE') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database misconfiguration',
              reference: 'DB_SCHEMA_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Fallback error yang tetap friendly
      throw new HttpException(
        {
          payload: {
            error: true,
            message:
              error.message ||
              'Unexpected error while retrieving draft loan application',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async renderDraftByMarketingId(marketingId: number) {
    try {
      const loanApps =
        await this.loanAppDraftRepo.findByMarketingId(marketingId);

      if (!loanApps || loanApps.length === 0) {
        const res = {
          payload: {
            error: 'false',
            message: 'No draft loan applications found for this marketing ID',
            reference: 'LOAN_NOT_FOUND',
          },
        };

        return res;
      }

      const processedLoans: Array<
        (typeof loanApps)[number] & {
          approval_recommendation:
            | MKT_GetDraftByMarketingId_ApprovalRecommendation
            | {
                error: string;
                message: string;
                reference: string;
              };
        }
      > = [];

      for (const loanApp of loanApps) {
        const nominalPinjaman =
          loanApp?.loan_application_internal?.nominal_pinjaman ?? 0;

        let approvalRecommendation:
          | MKT_GetDraftByMarketingId_ApprovalRecommendation
          | {
              error: string;
              message: string;
              reference: string;
            };

        if (nominalPinjaman >= 7000000) {
          try {
            const draftId = loanApp._id?.toString();
            if (!draftId) {
              approvalRecommendation = {
                error: 'DRAFT_ID_MISSING',
                message: 'Draft ID not found for loan application',
                reference: 'DRAFT_ID_MISSING',
              };
            } else {
              const recommendationData =
                await this.approvalRecommendationRepo.findByDraftId(draftId);

              if (recommendationData) {
                approvalRecommendation = {
                  draft_id: recommendationData.draft_id!,
                  nama_nasabah: recommendationData.nama_nasabah!,
                  recommendation: recommendationData.recommendation!,
                  filePath: recommendationData.filePath!,
                  catatan: recommendationData.catatan ?? null,
                };
              } else {
                approvalRecommendation = {
                  error: 'WAITING_ADMIN_BI_RECOMMENDATION',
                  message: 'Waiting Admin BI Responsibility',
                  reference: 'WAITING_ADMIN_BI_RECOMMENDATION',
                };
              }
            }
          } catch (innerError) {
            console.error('Error while fetching recommendation:', innerError);
            approvalRecommendation = {
              error: 'RECOMMENDATION_FETCH_FAILED',
              message: 'Gagal mengambil data rekomendasi BI Checking.',
              reference: 'RECOMMENDATION_FETCH_FAILED',
            };
          }
        } else {
          approvalRecommendation = {
            dont_have_check: true,
          } as MKT_GetDraftByMarketingId_ApprovalRecommendation;
        }

        processedLoans.push({
          ...loanApp,
          approval_recommendation: approvalRecommendation,
        });
      }

      return {
        payload: {
          error: false,
          message: 'Draft loan applications retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: processedLoans,
        },
      };
    } catch (error) {
      console.error('ERROR renderDraftByMarketingId:', error);

      // Tetap lempar kalau sudah HttpException bawaan
      if (error instanceof HttpException) {
        throw error;
      }

      // DB errors (Mongo / MySQL / Prisma)
      if (error.code === 'ECONNREFUSED' || error.name === 'MongoNetworkError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database connection error',
              reference: 'DB_CONNECTION_ERROR',
            },
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (error.code === 'ER_NO_SUCH_TABLE') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database schema error',
              reference: 'DB_SCHEMA_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Fallback — bukan 500 langsung
      throw new HttpException(
        {
          payload: {
            error: true,
            message:
              error?.message ||
              'Error occurred while retrieving draft loan applications',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDraftByMarketingId(id: string) {
    try {
      const deleteResult = await this.loanAppDraftRepo.softDelete(id);

      // Kalau repository ngasih indikasi "not found"
      if (!deleteResult) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Draft loan application not found for this ID',
              reference: 'LOAN_NOT_FOUND',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        payload: {
          error: false,
          message: 'Draft loan application deleted',
          reference: 'LOAN_DELETE_OK',
          data: [],
        },
      };
    } catch (error) {
      console.error('DeleteDraft Error >>>', error);

      // HttpException tetap diteruskan
      if (error instanceof HttpException) {
        throw error;
      }

      // DB connection error
      if (error.code === 'ECONNREFUSED' || error.name === 'MongoNetworkError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database connection error',
              reference: 'DB_CONNECTION_ERROR',
            },
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Kalau ID invalid (misalnya Mongo ObjectId invalid)
      if (error.name === 'CastError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Invalid draft ID format',
              reference: 'INVALID_ID_FORMAT',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // fallback (bukan 500 langsung)
      throw new HttpException(
        {
          payload: {
            error: true,
            message:
              error?.message ||
              'Unexpected error while deleting draft loan application',
            reference: 'LOAN_DELETE_ERROR',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
