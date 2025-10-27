import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY,
  ILoanApplicationDraftRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/LoanAppInt.repository';
import {
  CreateDraftLoanApplicationDto,
  PayloadDTO,
} from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppInt_MarketingInput/CreateDraft_LoanAppInt.dto';
import { LoanApplicationEntity } from 'src/Shared/Modules/Drafts/Domain/Entities/LoanAppInt.entity';
import {
  FILE_STORAGE_SERVICE,
  FileMetadata,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import sharp from 'sharp';

@Injectable()
export class MKT_CreateDraftLoanApplicationUseCase {
  constructor(
    @Inject(CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftRepository,

    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
  ) {}

  async executeCreateDraft(
    dto: PayloadDTO,
    files?: Record<string, Express.Multer.File[]>,
  ) {
    try {
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
        filePaths = await this.fileStorage.saveDraftsFiles(
          Number(dto?.client_internal?.no_ktp) ?? dto.client_internal.no_ktp,
          dto?.client_internal?.nama_lengkap ??
            `draft-${dto.client_internal.no_ktp}`,
          files,
        );

        // Assign hasil upload ke DTO sesuai field
        for (const [field, paths] of Object.entries(filePaths)) {
          if (paths && paths.length > 0) {
            // misal foto_ktp → simpan nama file atau path lengkap
            dto.client_internal[field] = paths[0].url;
            // jika mau simpan path lengkap:
            // dto.client_internal[field] = `${paths[0].prefix}${paths[0].usedFilename}`;
          }
        }
      }

      console.log('File paths:', filePaths);
      console.log('Payload (with marketingId):', dto);

      // 3️⃣ Simpan draft loan application
      const loanApp = await this.loanAppDraftRepo.create({
        ...dto,
        uploaded_files: filePaths,
      });

      return {
        dto: {
          error: false,
          message: 'Draft loan application created',
          reference: 'LOAN_CREATE_OK',
          data: loanApp,
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
            message: 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDraftById(
    Id: string,
    updateData: Partial<CreateDraftLoanApplicationDto>,
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

        filePaths = await this.fileStorage.saveDraftsFiles(
          Number(payload?.client_internal?.no_ktp) ?? Id,
          payload?.client_internal?.nama_lengkap ?? `draft-${Id}`,
          files,
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
              error: 'NOT FOUND',
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
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }

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

  async renderDraftByMarketingId(marketingId: number) {
    try {
      const loanApps =
        await this.loanAppDraftRepo.findByMarketingId(marketingId);

      if (loanApps.length === 0) {
        throw new HttpException(
          {
            payload: {
              error: 'NOT FOUND',
              message: 'No draft loan applications found for this marketing ID',
              reference: 'LOAN_NOT_FOUND',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        payload: {
          error: false,
          message: 'Draft loan applications retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: [...loanApps],
        },
      };
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        throw error;
      }

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

  async deleteDraftByMarketingId(id: string) {
    try {
      await this.loanAppDraftRepo.softDelete(id);

      return {
        payload: {
          error: false,
          message: 'Draft loan applications deleted',
          reference: 'LOAN_DELETE_OK',
          data: [],
        },
      };
    } catch (error) {
      console.error('DeleteDraft Error >>>', error);
      throw new HttpException(
        {
          payload: {
            error: true,
            message:
              error.message || 'Draft tidak ditemukan atau unexpected error',
            reference: 'LOAN_DELETE_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
