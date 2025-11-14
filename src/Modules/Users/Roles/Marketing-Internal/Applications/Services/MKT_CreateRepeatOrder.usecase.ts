import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ClientInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/client-internal.entity';
import { ClientInternalProfile } from 'src/Modules/LoanAppInternal/Domain/Entities/client-internal-profile.entity';
import { AddressInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/address-internal.entity';
import { FamilyInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/family-internal.entity';
import { JobInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/job-internal.entity';
import { LoanApplicationInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/loan-application-internal.entity';
import { CollateralInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/collateral-internal.entity';
import { RelativesInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/relative-internal.entity';

import {
  IClientInternalRepository,
  CLIENT_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/client-internal.repository';
import {
  CLIENT_INTERNAL_PROFILE_REPOSITORY,
  IClientInternalProfileRepository,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/client-internal-profile.repository';
import {
  IAddressInternalRepository,
  ADDRESS_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/address-internal.repository';
import {
  IFamilyInternalRepository,
  FAMILY_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/family-internal.repository';
import {
  IJobInternalRepository,
  JOB_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/job-internal.repository';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  ICollateralInternalRepository,
  COLLATERAL_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/collateral-internal.repository';
import {
  IRelativesInternalRepository,
  RELATIVE_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/relatives-internal.repository';

import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';

import { CreateLoanApplicationDto } from '../DTOS/MKT_CreateLoanApplication.dto';
import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';

import {
  StatusRumahEnum,
  DomisiliEnum,
} from 'src/Shared/Enums/Internal/Address.enum';

import {
  HubunganEnum,
  BekerjaEnum,
} from 'src/Shared/Enums/Internal/Family.enum';
import {
  GolonganEnum,
  PerusahaanEnum,
} from 'src/Shared/Enums/Internal/Job.enum';

import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

import { KerabatKerjaEnum } from 'src/Shared/Enums/Internal/Relative.enum';
import {
  PenjaminEnum,
  RiwayatPinjamPenjaminEnum,
} from 'src/Shared/Enums/Internal/Collateral.enum';
import {
  FILE_STORAGE_SERVICE,
  FileMetadata,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import sharp from 'sharp';
import {
  CREATE_DRAFT_REPEAT_ORDER_REPOSITORY,
  IDraftRepeatOrderRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/DraftRepeatOrder.repository';
import {
  CreateDraftRepeatOrderDto,
  PayloadDTO,
} from 'src/Shared/Modules/Drafts/Applications/DTOS/RepeatOrderInt_MarketingInput/CreateRO_DraftRepeatOrder.dto';
import { MKT_GetDraftByMarketingId_ApprovalRecommendation } from 'src/Shared/Interface/MKT_GetDraft/MKT_GetDraftByMarketingId.interface';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import { RepeatOrderEntity } from 'src/Shared/Modules/Drafts/Domain/Entities/DraftRepeatOrder.entity';

@Injectable()
export class MKT_CreateRepeatOrderUseCase {
  private readonly logger = new Logger(MKT_CreateRepeatOrderUseCase.name);
  constructor(
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendationRepo: IApprovalRecommendationRepository,
    @Inject(CREATE_DRAFT_REPEAT_ORDER_REPOSITORY)
    private readonly repeatOrderRepo: IDraftRepeatOrderRepository,
    @Inject(CLIENT_INTERNAL_REPOSITORY)
    private readonly clientRepo: IClientInternalRepository,
    @Inject(CLIENT_INTERNAL_PROFILE_REPOSITORY)
    private readonly clientProfileRepo: IClientInternalProfileRepository,
    @Inject(ADDRESS_INTERNAL_REPOSITORY)
    private readonly addressRepo: IAddressInternalRepository,
    @Inject(FAMILY_INTERNAL_REPOSITORY)
    private readonly familyRepo: IFamilyInternalRepository,
    @Inject(JOB_INTERNAL_REPOSITORY)
    private readonly jobRepo: IJobInternalRepository,
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(COLLATERAL_INTERNAL_REPOSITORY)
    private readonly collateralRepo: ICollateralInternalRepository,
    @Inject(RELATIVE_INTERNAL_REPOSITORY)
    private readonly relativeRepo: IRelativesInternalRepository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
  ) {}

  async submitRepeatOrder(
    dto: CreateLoanApplicationDto,
    client_id: number,
    files?: Record<string, Express.Multer.File[]>,
    repeatFromLoanId?: number,
  ) {
    const now = new Date();

    try {
      return await this.uow.start(async () => {
        const {
          client_internal,
          address_internal,
          family_internal,
          job_internal,
          loan_application_internal,
          collateral_internal,
          relative_internal,
          documents_files,
        } = dto;

        const client = await this.clientRepo.findById(client_id);
        if (!client) {
          throw new BadRequestException('Client not found');
        }

        // **2. Simpan AddressInternal**
        const addressEntity = new AddressInternal(
          { id: client_id! },
          address_internal.alamat_ktp,
          address_internal.rt_rw,
          address_internal.kelurahan,
          address_internal.kecamatan,
          address_internal.kota,
          address_internal.provinsi,
          address_internal.status_rumah as StatusRumahEnum,
          address_internal.domisili as DomisiliEnum,
          undefined,
          now,
          undefined,
          address_internal.status_rumah_ktp as StatusRumahEnum,
          address_internal.alamat_lengkap ?? '',
          now,
        );
        await this.addressRepo.save(addressEntity);

        // **3. Simpan FamilyInternal**
        const familyEntity = new FamilyInternal(
          { id: client_id! },
          family_internal.hubungan as HubunganEnum,
          family_internal.nama,
          family_internal.bekerja as BekerjaEnum,
          undefined,
          undefined,
          undefined,
          family_internal.nama_perusahaan!,
          family_internal.jabatan!,
          parseNumber(family_internal.penghasilan),
          family_internal.alamat_kerja!,
          family_internal.no_hp,
          undefined,
        );
        await this.familyRepo.save(familyEntity);

        // **4. Simpan JobInternal**
        const jobEntity = new JobInternal(
          { id: client_id! },
          job_internal.perusahaan as PerusahaanEnum,
          job_internal.divisi,
          job_internal.golongan as GolonganEnum,
          job_internal.nama_atasan!,
          job_internal.nama_hrd!,
          job_internal.absensi!,
          undefined,
          undefined,
          undefined,
          job_internal.yayasan!,
          job_internal.lama_kerja_bulan,
          job_internal.lama_kerja_tahun,
          undefined,
          undefined,
        );
        await this.jobRepo.save(jobEntity);

        // **5. Simpan LoanApplicationInternal**
        const isBandingBoolean =
          loan_application_internal.is_banding === 1 ? true : false;

        const loanAppEntity = new LoanApplicationInternal(
          { id: client_id! },
          (loan_application_internal.status_pinjaman as StatusPinjamanEnum.LAMA) ??
            StatusPinjamanEnum.LAMA,
          loan_application_internal.nominal_pinjaman ?? 0,
          loan_application_internal.tenor ?? 0,
          loan_application_internal.keperluan ?? '',
          undefined,
          undefined,
          undefined,
          (loan_application_internal.status ??
            'pending') as StatusPengajuanEnum,
          (loan_application_internal.status_akhir_pengajuan ??
            'done') as StatusPengajuanAkhirEnum,
          loan_application_internal.pinjaman_ke ?? 1,
          loan_application_internal.riwayat_nominal ?? 0,
          loan_application_internal.riwayat_tenor ?? 0,
          loan_application_internal.sisa_pinjaman ?? 0,
          loan_application_internal.notes ?? '',
          isBandingBoolean,
          loan_application_internal.alasan_banding ?? '',
        );

        const loanApp = await this.loanAppRepo.save(loanAppEntity);
        // ============== UPLOAD FILES KE MINIO ==============
        let minioUploadResult;
        if (files && Object.keys(files).length > 0) {
          // ============== CONVERT IMAGES TO JPEG USING SHARP ==============
          for (const [field, fileArray] of Object.entries(files)) {
            if (!fileArray) continue;

            for (const file of fileArray) {
              // Convert gambar ke JPEG tanpa resize
              if (file.mimetype.startsWith('image/')) {
                try {
                  const outputBuffer = await sharp(file.buffer)
                    .jpeg({ quality: 100 })
                    .toBuffer();

                  // Update file buffer dan filename
                  file.buffer = outputBuffer;
                  file.originalname = file.originalname.replace(
                    /\.\w+$/,
                    '.jpeg',
                  );
                  file.mimetype = 'image/jpeg'; // ← Update mimetype juga

                  this.logger.log(
                    `Converted ${field} to JPEG: ${file.originalname}`,
                  );
                } catch (error) {
                  this.logger.error(
                    `Error converting ${field} to JPEG:`,
                    error,
                  );
                  // Skip conversion kalau error, tetep pake file original
                }
              }
            }
          }

          // ============== GET NEXT REPEAT ORDER INDEX ==============
          const nextPengajuanIndex =
            await this.fileStorage.getNextPengajuanIndex(
              Number(client_internal.no_ktp),
              client_internal.nama_lengkap,
              false,
            );

          this.logger.log('Upload files info:', {
            nextPengajuanIndex,
            repeatFromLoanId,
            nik: Number(client_internal.no_ktp),
            customerName: client_internal.nama_lengkap,
          });

          // ============== SAVE FILES ==============
          minioUploadResult = await this.fileStorage.saveRepeatOrderFiles(
            Number(client_internal.no_ktp),
            client_internal.nama_lengkap,
            nextPengajuanIndex,
            files,
            repeatFromLoanId,
            {
              loanId: loanApp.id!,
              nasabahId: client_id,
              nominalPinjaman: loan_application_internal.nominal_pinjaman ?? 0,
              tenor: loan_application_internal.tenor ?? 0,
            },
          );

          this.logger.log('Minio upload result:', minioUploadResult);
        }

        // **1A. Mapping Dulu ke Profile dengan URL dari Minio**
        const clientProfileEntity = new ClientInternalProfile(
          { id: client_id! },
          { id: loanApp.id! },
          client_internal.nama_lengkap,
          client_internal.jenis_kelamin,
          client_internal.tipe_nasabah as CLIENT_TYPE,
          client_internal.no_hp,
          client_internal.status_nikah as MARRIAGE_STATUS,
          undefined,
          client_internal.email,
          minioUploadResult?.savedFiles?.foto_ktp?.[0]?.url ??
            parseFileUrl(
              documents_files?.foto_ktp ?? client_internal.foto_ktp ?? null,
            ),
          minioUploadResult?.savedFiles?.foto_kk?.[0]?.url ??
            parseFileUrl(
              documents_files?.foto_kk ?? client_internal.foto_kk ?? null,
            ),
          minioUploadResult?.savedFiles?.foto_id_card?.[0]?.url ??
            parseFileUrl(documents_files?.foto_id_card ?? null),
          minioUploadResult?.savedFiles?.foto_rekening?.[0]?.url ??
            parseFileUrl(documents_files?.foto_rekening ?? null),
          client_internal.no_rekening as string,
        );
        await this.clientProfileRepo.save(clientProfileEntity);

        // Update job entity dengan bukti absensi URL dari Minio
        if (minioUploadResult?.savedFiles?.bukti_absensi) {
          jobEntity.bukti_absensi =
            minioUploadResult.savedFiles.bukti_absensi[0].url;
          await this.jobRepo.save(jobEntity);
        }

        // **6. Simpan CollateralInternal**
        const collEntity = new CollateralInternal(
          { id: client_id! },
          collateral_internal.jaminan_hrd,
          collateral_internal.jaminan_cg,
          collateral_internal.penjamin as PenjaminEnum,
          undefined,
          undefined,
          undefined,
          collateral_internal.nama_penjamin,
          collateral_internal.lama_kerja_penjamin!,
          collateral_internal.bagian!,
          collateral_internal.absensi_penjamin!,
          collateral_internal.riwayat_pinjam_penjamin as RiwayatPinjamPenjaminEnum,
          collateral_internal.riwayat_nominal_penjamin!,
          collateral_internal.riwayat_tenor_penjamin!,
          collateral_internal.sisa_pinjaman_penjamin!,
          collateral_internal.jaminan_cg_penjamin!,
          collateral_internal.status_hubungan_penjamin!,
          minioUploadResult?.savedFiles?.foto_ktp_penjamin?.[0]?.url ??
            parseFileUrl(documents_files?.foto_ktp_penjamin ?? null),
          minioUploadResult?.savedFiles?.foto_id_card_penjamin?.[0]?.url ??
            parseFileUrl(documents_files?.foto_id_card_penjamin ?? null),
          undefined,
        );
        await this.collateralRepo.save(collEntity);

        // **7. Simpan RelativesInternal**
        if (relative_internal) {
          const relEntity = new RelativesInternal(
            { id: client_id! },
            relative_internal.kerabat_kerja as KerabatKerjaEnum,
            undefined,
            relative_internal.nama,
            relative_internal.alamat,
            relative_internal.no_hp,
            relative_internal.status_hubungan!,
            relative_internal.nama_perusahaan!,
            undefined,
            undefined,
            undefined,
          );
          await this.relativeRepo.save(relEntity);
        }

        // Return sukses
        return {
          payload: {
            error: false,
            message: minioUploadResult?.isUpdate
              ? `Repeat Order ke-${minioUploadResult.originalLoanId} berhasil dibuat`
              : 'Pengajuan baru berhasil dibuat',
            reference: 'REPEAT_ORDER_CREATE_OK',
            data: {
              loanAppId: loanApp.id,
              clientId: client_id,
              isUpdate: minioUploadResult?.isUpdate ?? false,
              isRepeatOrder: !!repeatFromLoanId,
              pengajuanFolder: minioUploadResult?.pengajuanFolder,
              originalLoanId: minioUploadResult?.originalLoanId,
              filesUploaded: minioUploadResult?.savedFiles
                ? Object.keys(minioUploadResult.savedFiles).length
                : 0,
            },
          },
        };
      });
    } catch (err) {
      console.error('Error in CreateRepeatOrderUseCase:', err);
      throw new BadRequestException(err.message || 'Gagal membuat pengajuan');
    }
  }

  async executeCreateDraft(
    dto: PayloadDTO,
    client_id: number,
    marketingId: number, // ← Tambah parameter marketing_id
    files?: Record<string, Express.Multer.File[]>,
    repeatFromLoanId?: number,
  ) {
    try {
      let minioUploadResult;

      // ============== ASSIGN marketing_id ke DTO ==============
      dto.marketing_id = marketingId;

      console.log('>>>>>>>>>>>>>>>>>>>..', dto);

      // ============== LOG REQUEST INFO ==============
      console.log('=== Create Draft Repeat Order ===');
      console.log('Marketing ID:', marketingId);
      console.log('Client ID:', client_id);
      console.log('Repeat From Loan ID:', repeatFromLoanId);
      console.log('Files received:', files ? Object.keys(files) : 'No files');
      console.log('Payload preview:', {
        nama: dto.client_internal?.nama_lengkap,
        nik: dto.client_internal?.no_ktp,
        nominal: dto.loan_application_internal?.nominal_pinjaman,
      });

      // ============== PROSES FILE KALAU ADA ==============
      if (files && Object.keys(files).length > 0) {
        // ============== CONVERT IMAGES TO JPEG USING SHARP ==============
        for (const [field, fileArray] of Object.entries(files)) {
          if (!fileArray) continue;

          for (const file of fileArray) {
            // Convert gambar ke JPEG tanpa resize
            if (file.mimetype.startsWith('image/')) {
              try {
                const outputBuffer = await sharp(file.buffer)
                  .jpeg({ quality: 100 })
                  .toBuffer();

                // Update file buffer dan filename
                file.buffer = outputBuffer;
                file.originalname = file.originalname.replace(
                  /\.\w+$/,
                  '.jpeg',
                );
                file.mimetype = 'image/jpeg';

                console.log(
                  `✓ Converted ${field} to JPEG: ${file.originalname}`,
                );
              } catch (error) {
                console.error(`✗ Error converting ${field} to JPEG:`, error);
                // Skip conversion kalau error, tetep pake file original
              }
            }
          }
        }

        // ============== GET NEXT PENGAJUAN INDEX ==============
        const nextPengajuanIndex = await this.fileStorage.getNextPengajuanIndex(
          Number(dto.client_internal.no_ktp),
          dto.client_internal.nama_lengkap,
          true, // isDraft = true untuk draft
        );

        console.log('MinIO Upload Info:', {
          nextPengajuanIndex,
          repeatFromLoanId,
          nik: dto.client_internal.no_ktp,
          customerName: dto.client_internal.nama_lengkap,
          isDraft: true,
        });

        // ============== SAVE FILES PAKAI saveRepeatOrderFiles ==============
        minioUploadResult = await this.fileStorage.saveRepeatOrderFiles(
          Number(dto.client_internal.no_ktp),
          dto.client_internal.nama_lengkap,
          nextPengajuanIndex,
          files,
          repeatFromLoanId,
          {
            loanId: null, // Draft belum punya loanId permanent
            nasabahId: client_id,
            nominalPinjaman:
              dto.loan_application_internal?.nominal_pinjaman ?? 0,
            tenor: dto.loan_application_internal?.tenor ?? 0,
          },
        );

        console.log('MinIO upload success:', {
          folder: minioUploadResult?.pengajuanFolder,
          filesCount: minioUploadResult?.savedFiles
            ? Object.keys(minioUploadResult.savedFiles).length
            : 0,
        });
      }

      // ============== BUILD UPLOADED FILES OBJECT ==============
      const uploadedFiles: Record<string, any> = {
        ...(minioUploadResult?.savedFiles ?? {}),
      };

      // ============== ASSIGN URL FILE KE DTO ==============
      if (minioUploadResult?.savedFiles) {
        const savedFiles = minioUploadResult.savedFiles;

        // Bukti absensi ke job_internal (kalau ada)
        if (savedFiles.bukti_absensi?.[0]?.url && dto.job_internal) {
          dto.job_internal.bukti_absensi = savedFiles.bukti_absensi[0].url;
          console.log('✓ Assigned bukti_absensi URL to job_internal');
        }

        // File penjamin ke collateral_internal (kalau ada)
        if (savedFiles.foto_ktp_penjamin?.[0]?.url && dto.collateral_internal) {
          dto.collateral_internal.foto_ktp_penjamin =
            savedFiles.foto_ktp_penjamin[0].url;
          console.log(
            '✓ Assigned foto_ktp_penjamin URL to collateral_internal',
          );
        }
        if (
          savedFiles.foto_id_card_penjamin?.[0]?.url &&
          dto.collateral_internal
        ) {
          dto.collateral_internal.foto_id_card_penjamin =
            savedFiles.foto_id_card_penjamin[0].url;
          console.log(
            '✓ Assigned foto_id_card_penjamin URL to collateral_internal',
          );
        }
      }

      // ============== SIMPAN DRAFT KE MONGODB ==============
      const draftData: any = {
        ...dto,
        uploaded_files: uploadedFiles,
      };

      // Tambahkan minio_metadata kalau ada upload file
      if (minioUploadResult) {
        draftData.minio_metadata = {
          pengajuanFolder: minioUploadResult.pengajuanFolder,
          isUpdate: minioUploadResult.isUpdate ?? false,
          originalLoanId: minioUploadResult.originalLoanId,
          isRepeatOrder: !!repeatFromLoanId,
          nextPengajuanIndex: minioUploadResult.nextPengajuanIndex,
        };
      }

      console.log('Saving draft to MongoDB...');
      const loanApp = await this.repeatOrderRepo.create(draftData);

      if (!loanApp) {
        throw new Error('Failed to Create Draft');
      }

      console.log('✓ Draft saved with ID:', loanApp._id);

      // ============== TRIGGER BI CHECKING ==============
      const nominalPinjaman = Number(
        dto.loan_application_internal?.nominal_pinjaman ?? 0,
      );
      if (nominalPinjaman >= 7000000) {
        console.log(' Nominal >= 7jt, triggering BI Checking...');
        await this.repeatOrderRepo.triggerIsNeedCheckBeingTrue(
          loanApp._id?.toString(),
          nominalPinjaman,
        );
        console.log('✓ BI Checking flag set');
      }

      // ============== RETURN SUCCESS ==============
      const response = {
        dto: {
          error: false,
          message: minioUploadResult?.isUpdate
            ? `Draft Repeat Order ke-${minioUploadResult.originalLoanId} berhasil dibuat`
            : 'Draft pengajuan baru berhasil dibuat',
          reference: 'LOAN_CREATE_OK',
          data: {
            _id: loanApp._id,
            client_internal: loanApp.client_internal,
            loan_application_internal: loanApp.loan_application_internal,
            filesUploaded: minioUploadResult?.savedFiles
              ? Object.keys(minioUploadResult.savedFiles).length
              : 0,
            pengajuanFolder: minioUploadResult?.pengajuanFolder,
            isRepeatOrder: !!repeatFromLoanId,
            requiresBICheck: nominalPinjaman >= 7000000,
          },
        },
      };

      console.log('=== Draft Created Successfully ===\n');
      return response;
    } catch (err) {
      console.error('=== Error Creating Draft ===');
      console.error(err);

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
            message: err.message || 'Unexpected error',
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
        await this.repeatOrderRepo.findByMarketingId(marketingId);

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
      console.error(error);

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

  async updateDraftById(
    Id: string,
    updateData: Partial<CreateDraftRepeatOrderDto>,
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

      const existingDraft = await this.repeatOrderRepo.findById(Id);

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

      const entityUpdate: Partial<RepeatOrderEntity> = {
        ...payload,
        uploaded_files: mergedFiles,
      };

      const loanApp = await this.repeatOrderRepo.updateDraftById(
        Id,
        entityUpdate,
      );

      const verifyAfterUpdate = await this.repeatOrderRepo.findById(Id);

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
      const loanApp = await this.repeatOrderRepo.findById(Id);
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
}

function parseFileUrl(
  input: string | Express.Multer.File | null | undefined,
): string | undefined {
  if (!input) return undefined;
  if (typeof input === 'string') {
    return input;
  }
  if (typeof input === 'object' && 'path' in input) {
    return `http://your-server-url.com/${input.path}`;
  }
  return undefined;
}

function parseNumber(
  value: string | number | null | undefined,
): number | undefined {
  if (value === null || value === undefined) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}
