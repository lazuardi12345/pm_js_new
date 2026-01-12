import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  PayloadExternalDTO,
  CreateDraftLoanApplicationExtDto,
} from 'src/Shared/Modules/Drafts/Applications/DTOS/LoanAppExt_MarketingInput/CreateDraft_LoanAppExt.dto';
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
  CLIENT_EXTERNAL_REPOSITORY,
  IClientExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external.repository';
import { ExternalCollateralType } from 'src/Shared/Enums/General/General.enum';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { LoanApplicationExtEntity } from 'src/Shared/Modules/Drafts/Domain/Entities/ext/LoanAppExt.entity';
import { contains } from 'class-validator';

@Injectable()
export class MKT_CreateDraftLoanApplicationUseCase {
  constructor(
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftExternalRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly clientRepo: IClientExternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendationRepo: IApprovalRecommendationRepository,
  ) {}

  async executeCreateDraft(
    dto: PayloadExternalDTO,
    files?: Record<string, Express.Multer.File[]>,
    external_loan_type?: ExternalCollateralType,
    jenis_pembiayaan?: JenisPembiayaanEnum,
  ) {
    console.log(external_loan_type);

    if (
      dto.client_external.no_hp.length >= 14 &&
      /[\(\)\+]/.test(dto.client_external.no_hp)
    ) {
      throw new BadRequestException(
        'Nomor HP tidak boleh mengandung tanda kurung () atau + jika panjangnya 14 karakter atau lebih',
      );
    } else if (
      !dto.client_external?.nik ||
      !/^\d{16}$/.test(dto.client_external.nik)
    ) {
      throw new BadRequestException('NIK wajib berupa 16 digit angka');
    }

    const duplicateChecker = await this.clientRepo.findByKtp(
      Number(dto.client_external.nik),
    );

    if (duplicateChecker) {
      throw new HttpException(
        'This Client National Identity Number already registered',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      if (external_loan_type) {
        const collateralFieldMap = {
          t1: 'collateral_bpjs_external',
          t2: 'collateral_bpkb_external',
          t3: 'collateral_shm_external',
          t4: 'collateral_umkm_external',
          t5: 'collateral_kedinasan_mou_external',
          t6: 'collateral_kedinasan_non_mou_external',
        };

        const targetCollateralField = collateralFieldMap[external_loan_type];

        if (!targetCollateralField) {
          throw new HttpException(
            `Invalid external_loan_type: ${external_loan_type}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!dto[targetCollateralField]) {
          throw new HttpException(
            `Collateral data for type ${external_loan_type} is required`,
            HttpStatus.BAD_REQUEST,
          );
        }

        dto.loan_external_type = external_loan_type;

        if (jenis_pembiayaan && dto.loan_application_external) {
          dto.loan_application_external.jenis_pembiayaan = jenis_pembiayaan;
          console.log(`Assigned jenis_pembiayaan: ${jenis_pembiayaan}`);
        }

        Object.values(collateralFieldMap).forEach((field) => {
          if (field !== targetCollateralField) {
            delete dto[field];
          }
        });
        console.log(
          `Cleaned collateral. Only keeping: ${targetCollateralField}`,
        );
      }

      let filePaths: Record<string, FileMetadata[]> = {};
      if (files && Object.keys(files).length > 0) {
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
          Number(dto?.client_external?.nik) ?? dto.client_external.nik,
          dto?.client_external?.nama_lengkap ??
            `draft-${dto.client_external.nik}`,
          files,
          REQUEST_TYPE.EXTERNAL,
        );
        for (const [fieldName, paths] of Object.entries(filePaths)) {
          if (paths && paths.length > 0) {
            const url = paths[0].url;
            const fieldToParentMap = {
              foto_ktp: 'client_external',
            };

            const parentKey = fieldToParentMap[fieldName];

            if (parentKey && dto[parentKey]) {
              dto[parentKey][fieldName] = url;
              console.log(`### Assigned ${fieldName} to ${parentKey}`);
            } else {
              console.log(
                `###  Warning: No parent found for ${fieldName}, skipping...`,
              );
            }
          }
        }
      }

      const loanApp = await this.loanAppDraftRepo.create({
        ...dto,
        loan_external_type: dto.loan_external_type,
        uploaded_files: filePaths,
      });

      if (!loanApp) {
        throw new Error('Failed to Create Draft');
      } else {
        await this.loanAppDraftRepo.triggerIsNeedCheckBeingTrue(
          loanApp._id?.toString(),
          Number(dto.loan_application_external?.nominal_pinjaman),
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
      console.log(err);

      if (
        err instanceof HttpException ||
        typeof err.getStatus === 'function' ||
        typeof err.status === 'number'
      ) {
        throw err;
      }

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

  async updateDraftById(
    Id: string,
    marketingId: number,
    updateData: Partial<CreateDraftLoanApplicationExtDto>,
    files?: Record<string, Express.Multer.File[]>,
    type?: ExternalCollateralType,
  ) {
    const { payload } = updateData;
    const loanApp = await this.loanAppDraftRepo.findById(Id);

    if (!payload) {
      throw new BadRequestException('Payload is required');
    } else if (loanApp!.marketing_id !== marketingId) {
      throw new HttpException(
        {
          payload: {
            error: true,
            message: 'Access Denied',
            reference: 'MISMATCH_MARKETING_ID',
          },
        },
        HttpStatus.FORBIDDEN,
      );
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
          Number(payload?.client_external?.nik) ?? Id,
          payload?.client_external?.nama_lengkap ?? `draft-${Id}`,
          files,
          REQUEST_TYPE.EXTERNAL,
        );

        // Mapping field ke parent object
        const fieldToParentMap: Record<string, string> = {
          // Job external files
          foto_id_card_peminjam: 'job_external',
          slip_gaji: 'job_external',

          // Address external files
          foto_meteran_listrik: 'address_external',

          // Guarantor external files
          foto_ktp_penjamin: 'loan_guarantor_external',

          // Client external files
          foto_ktp: 'client_external',
          foto_kk: 'client_external',
          foto_rekening: 'client_external',

          // Collateral BPJS
          foto_bpjs: 'collateral_bpjs_external',
          dokumen_pendukung_bpjs: 'collateral_bpjs_external',

          // Collateral SHM
          foto_shm: 'collateral_shm_external',
          foto_kk_pemilik_shm: 'collateral_shm_external',
          foto_pbb: 'collateral_shm_external',
          foto_objek_jaminan: 'collateral_shm_external',
          foto_buku_nikah_suami_istri: 'collateral_shm_external',
          foto_npwp: 'collateral_shm_external',
          foto_imb: 'collateral_shm_external',
          foto_surat_ahli_waris: 'collateral_shm_external',
          foto_surat_akte_kematian: 'collateral_shm_external',
          foto_surat_pernyataan_kepemilikan_tanah: 'collateral_shm_external',

          foto_no_rangka: 'collateral_bpkb_external',
          foto_no_mesin: 'collateral_bpkb_external',
          foto_faktur_kendaraan: 'collateral_bpkb_external',
          foto_snikb: 'collateral_bpkb_external',
          dokumen_bpkb: 'collateral_bpkb_external',
          foto_stnk_depan: 'collateral_bpkb_external',
          foto_stnk_belakang: 'collateral_bpkb_external',
          foto_kendaraan_depan: 'collateral_bpkb_external',
          foto_kendaraan_belakang: 'collateral_bpkb_external',
          foto_kendaraan_samping_kanan: 'collateral_bpkb_external',
          foto_kendaraan_samping_kiri: 'collateral_bpkb_external',
          foto_sambara: 'collateral_bpkb_external',
          foto_kwitansi_jual_beli: 'collateral_bpkb_external',
          foto_ktp_tangan_pertama: 'collateral_bpkb_external',
        };

        // Assign URLs ke parent objects
        for (const [field, paths] of Object.entries(filePaths)) {
          if (paths && paths.length > 0) {
            const parentKey = fieldToParentMap[field];

            if (parentKey) {
              payload[parentKey] = {
                ...(payload[parentKey] ?? {}),
                [field]: paths[0].url,
              };
            } else {
              // Fallback: assign ke root level
              payload[field] = paths[0].url;
            }
          }
        }
        console.log(
          'Payload after file assignment:',
          JSON.stringify(payload, null, 2),
        );
      }

      if (type) {
        const collateralFieldMap = {
          [ExternalCollateralType.t1]: 'collateral_shm_external',
          [ExternalCollateralType.t2]: 'collateral_umkm_external',
          [ExternalCollateralType.t3]: 'collateral_bpjs_external',
          [ExternalCollateralType.t4]: 'collateral_bpkb_external',
          [ExternalCollateralType.t5]: 'collateral_kedinasan_mou_external',
          [ExternalCollateralType.t6]: 'collateral_kedinasan_non_mou_external',
        };

        const selectedCollateral = collateralFieldMap[type];

        if (!payload[selectedCollateral]) {
          throw new HttpException(
            `Collateral data for type ${type} is required`,
            HttpStatus.BAD_REQUEST,
          );
        }

        payload.loan_external_type = type;
        Object.values(collateralFieldMap).forEach((field) => {
          if (field !== selectedCollateral) {
            payload[field] = undefined;
          }
        });
      }

      const existingDraft = await this.loanAppDraftRepo.findById(Id);

      if (!existingDraft) {
        throw new NotFoundException(`Draft with id ${Id} not found`);
      }

      const existingFiles = { ...(existingDraft.uploaded_files || {}) };

      // Remove old files yang diganti dengan file baru
      const getBaseName = (fieldName: string): string => {
        return fieldName.split('.')[0];
      };

      for (const newFieldName of Object.keys(filePaths)) {
        const newBaseName = getBaseName(newFieldName);

        for (const existingFieldName of Object.keys(existingFiles)) {
          const existingBaseName = getBaseName(existingFieldName);

          if (existingBaseName === newBaseName) {
            delete existingFiles[existingFieldName];
          }
        }
      }

      const mergedFiles = {
        ...existingFiles,
        ...filePaths,
      };

      // Build entityUpdate secara dinamis
      const entityUpdate: Partial<LoanApplicationExtEntity> = {
        uploaded_files: mergedFiles,
      };

      // List field yang perlu di-merge (nested objects)
      const nestedFields = [
        'client_external',
        'address_external',
        'job_external',
        'loan_application_external',
        'loan_guarantor_external',
        'financial_dependents_external',
        'other_exist_loan_external',
        'emergency_contact_external',
        'collateral_shm_external',
        'collateral_bpkb_external',
        'collateral_bpjs_external',
        'collateral_umkm_external',
        'collateral_kedinasan_mou_external',
        'collateral_kedinasan_non_mou_external',
      ];

      // Merge nested objects
      for (const field of nestedFields) {
        if (payload[field]) {
          entityUpdate[field] = {
            ...(existingDraft[field] ?? {}),
            ...payload[field],
          };
        }
      }

      // Primitive fields - langsung assign
      const primitiveFields = [
        'loan_external_type',
        'marketing_id',
        'isCompleted',
        'isNeedCheck',
      ];

      for (const field of primitiveFields) {
        if (payload[field] !== undefined) {
          entityUpdate[field] = payload[field];
        }
      }

      // Update ke database (ini tetap sama)
      await this.loanAppDraftRepo.updateDraftById(Id, entityUpdate);

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

      if (err instanceof HttpException) {
        throw err;
      }

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
            payload: {
              error: 'DUPLICATE KEY',
              message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
              reference: 'LOAN_DUPLICATE_KEY',
            },
          },
          HttpStatus.CONFLICT,
        );
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

  async renderDraftById(Id: string, marketingId: number) {
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
      } else if (loanApp.marketing_id !== marketingId) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Access Denied',
              reference: 'MISMATCH_MARKETING_ID',
            },
          },
          HttpStatus.FORBIDDEN,
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
        return {
          payload: {
            error: false,
            message: 'Draft loan applications retrieved but not found',
            reference: 'LOAN_RETRIEVE_OK_BUT_NOT_FOUND',
          },
        };
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
          loanApp?.loan_application_external?.nominal_pinjaman ?? 0;

        let approvalRecommendation:
          | MKT_GetDraftByMarketingId_ApprovalRecommendation
          | {
              error: string;
              message: string;
              reference: string;
            };

        if (nominalPinjaman >= 0) {
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
