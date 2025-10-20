import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  NotFoundException,
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

@Injectable()
export class MKT_CreateDraftLoanApplicationUseCase {
  constructor(
    @Inject(CREATE_DRAFT_LOAN_APPLICATION_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftRepository,

    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
  ) {}

  // Utility: sanitize client name for file/folder names
  private sanitizeClientName(name: string | undefined, fallback: string): string {
    const rawName = name?.trim() || fallback;
    return rawName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
  }

  async executeCreateDraft(
    dto: PayloadDTO,
    files?: Record<string, Express.Multer.File[]>,
  ) {
    try {
      let filePaths: Record<string, FileMetadata[]> = {};

      if (files && Object.keys(files).length > 0) {
        // Pastikan no_ktp string atau number
        const noKtp = dto?.client_internal?.no_ktp;
        const clientNameSafe = this.sanitizeClientName(
          dto?.client_internal?.nama_lengkap,
          `draft-${noKtp ?? 'unknown'}`,
        );

        filePaths = await this.fileStorage.saveDraftsFiles(
          Number(noKtp) || 0, // fallback ke 0 jika gagal konversi
          clientNameSafe,
          files,
        );
      }

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
      console.error('CreateDraft Error:', err);

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
          client_and_loan_detail: loanApp,
        },
      };
    } catch (error) {
      console.error('RenderDraftById Error:', error);

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
      const loanApps = await this.loanAppDraftRepo.findByMarketingId(marketingId);

      if (!loanApps || loanApps.length === 0) {
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
          data: loanApps,
        },
      };
    } catch (error) {
      console.error('RenderDraftByMarketingId Error:', error);

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
      console.error('DeleteDraft Error:', error);
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

  async updateDraftById(
    Id: string,
    updateData: Partial<CreateDraftLoanApplicationDto>,
    files?: Record<string, Express.Multer.File[]>,
  ) {
    const { payload } = updateData;
    console.log('Update payload:', payload);

    let filePaths: Record<string, FileMetadata[]> = {};

    if (files && Object.keys(files).length > 0) {
      const clientNameSafe = this.sanitizeClientName(
        payload?.client_internal?.nama_lengkap,
        `draft-${Id}`,
      );

      const noKtp = payload?.client_internal?.no_ktp;

      filePaths = await this.fileStorage.saveDraftsFiles(
        Number(noKtp) || 0,
        clientNameSafe,
        files,
      );
    }

    try {
      const existingDraft = await this.loanAppDraftRepo.findById(Id);

      if (!existingDraft) {
        throw new NotFoundException(`Draft with id ${Id} not found`);
      }

      // Merge uploaded files baru dengan yang lama, hati-hati overwrite key sama
      const mergedFiles: Record<string, FileMetadata[]> = {
        ...existingDraft.uploaded_files,
      };

      // Append or overwrite keys from new files
      for (const key in filePaths) {
        if (filePaths.hasOwnProperty(key)) {
          if (!mergedFiles[key]) {
            mergedFiles[key] = [];
          }
          mergedFiles[key] = mergedFiles[key].concat(filePaths[key]);
        }
      }

      const entityUpdate: Partial<LoanApplicationEntity> = {
        ...payload,
        uploaded_files: mergedFiles,
      };

      const loanApp = await this.loanAppDraftRepo.updateDraftById(Id, entityUpdate);
      console.log('Repository returned:', JSON.stringify(loanApp, null, 2));

      const verifyAfterUpdate = await this.loanAppDraftRepo.findById(Id);

      return {
        payload: {
          error: false,
          message: 'Draft loan applications updated',
          reference: 'LOAN_UPDATE_OK',
          data: verifyAfterUpdate,
        },
      };
    } catch (error) {
      console.error('UpdateDraft Error:', error);

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
}
