import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  IClientInternalRepository,
  CLIENT_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/client-internal.repository';
import {
  IClientInternalProfileRepository,
  CLIENT_INTERNAL_PROFILE_REPOSITORY,
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
  IFileStorageRepository,
  FILE_STORAGE_SERVICE,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { LoanInternalDto } from '../DTOS/MKT_CreateLoanApplicationExternal.dto';
import sharp from 'sharp';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';
import { ClientInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/client-internal.entity';

@Injectable()
export class MKT_UpdateLoanApplicationUseCase {
  private readonly baseFileUrl = `http://${process.env.BACKEND_URI}/storage`;

  constructor(
    @Inject(CLIENT_INTERNAL_REPOSITORY)
    private readonly clientRepo: IClientInternalRepository,
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
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  private sanitizeName(name: string): string {
    return name?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown_client';
  }

  private getFileExtension(filename: string): string {
    const match = filename.match(/\.[0-9a-z]+$/i);
    return match ? match[0] : '';
  }

  private sanitizeDate(date: Date | string): Date {
    return new Date(date);
  }

  async execute(
    payload: any,
    files: Record<string, Express.Multer.File[]>,
    clientId: number,
    marketingId?: number,
    loanId?: number,
  ) {
    const now = this.sanitizeDate(new Date());

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
        } = payload;

        const client = await this.clientRepo.findById(clientId);
        if (!client) {
          return {
            payload: {
              error: true,
              message: 'Client tidak ditemukan',
              reference: 'CLIENT_NOT_FOUND',
              data: null,
            },
          };
        }

        const filePaths: Record<string, string> = {};
        let isUpdated = false;

        // ==================== FILE HANDLING =====================
        try {
          if (files && Object.keys(files).length > 0) {
            const allowedFields = [
              'foto_ktp',
              'foto_kk',
              'foto_id_card',
              'bukti_absensi_file',
              'foto_ktp_penjamin',
              'foto_id_card_penjamin',
              'foto_rekening',
            ];

            const prepareForClientName = client.nama_lengkap
              .trim()
              .replace(/\s+/g, '_');

            const prepareForClientId = Number(client.no_ktp);

            for (const [fieldName, fileArray] of Object.entries(files)) {
              const file = fileArray?.[0];
              if (!file || !allowedFields.includes(fieldName)) continue;

              let newBuffer = file.buffer;
              let newExt = this.getFileExtension(file.originalname);

              if (allowedFields.includes(fieldName)) {
                newBuffer = await sharp(file.buffer)
                  .jpeg({ quality: 90 })
                  .toBuffer();
                newExt = '.jpeg';
              }

              const finalFileName = `${client.nama_lengkap}-${fieldName}${newExt}.enc`;

              await this.fileStorage.updateFile(
                prepareForClientId,
                prepareForClientName,
                finalFileName,
                { ...file, buffer: newBuffer },
                false,
              );

              filePaths[fieldName] =
                `${this.baseFileUrl}/${prepareForClientId}/${prepareForClientName}/${encodeURIComponent(finalFileName)}`;

              isUpdated = true;
            }
          }
        } catch (e) {
          throw new BadRequestException('Gagal memproses file upload');
        }

        // ============= FUNCTION UPDATE DATA MURNI ===============
        const updateIfExist = async (repo, data, name) => {
          if (!data || Object.keys(data).length === 0) return {};

          const existing = await repo.findById(clientId);
          const preparedData = { ...data, updated_at: now };

          if (!existing) {
            await repo.save({
              ...preparedData,
              nasabah: { id: clientId },
              createdAt: now,
              updatedAt: now,
            });
            isUpdated = true;
            return preparedData;
          }

          await repo.update(existing.id, preparedData);
          isUpdated = true;
          return preparedData;
        };

        // ============= CLEANUP CLIENT DATA =============
        let updatedClientData = {};
        if (client_internal || Object.keys(filePaths).length > 0) {
          const sanitized = {
            ...client_internal,
            ...filePaths,
            updated_at: now,
          };

          Object.keys(sanitized).forEach((key) => {
            if (sanitized[key] === undefined) delete sanitized[key];
            if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
              if (Object.keys(sanitized[key]).length === 0)
                sanitized[key] = null;
            }
          });

          const changed = Object.entries(sanitized).some(
            ([key, val]) => client[key] !== val,
          );

          if (changed) {
            await this.clientRepo.save({
              ...client,
              ...sanitized,
            });
            isUpdated = true;
          }

          updatedClientData = sanitized;
        }

        // ============= PART UPDATE ENTITY LAIN =============
        const updatedAddressData = await updateIfExist(
          this.addressRepo,
          address_internal,
          'Address',
        );
        const updatedFamilyData = await updateIfExist(
          this.familyRepo,
          family_internal,
          'Family',
        );
        const updatedJobData = await updateIfExist(
          this.jobRepo,
          job_internal,
          'Job',
        );

        // kolateral pakai file path jika ada
        if (collateral_internal) {
          ['foto_ktp_penjamin', 'foto_id_card_penjamin'].forEach((k) => {
            collateral_internal[k] = filePaths[k] ?? null;
          });
        }

        const updatedCollateralData = await updateIfExist(
          this.collateralRepo,
          collateral_internal,
          'Collateral',
        );

        const updatedRelativeData = await updateIfExist(
          this.relativeRepo,
          relative_internal,
          'Relative',
        );

        // ============= LOAN APPLICATION =================
        let updatedLoanAppData = {};
        if (
          loan_application_internal &&
          Object.keys(loan_application_internal).length > 0
        ) {
          const foundApps = await this.loanAppRepo.findByNasabahId(client.id!);
          const loanApp = foundApps?.[0];

          if (loanApp) {
            await this.loanAppRepo.update(loanApp.id!, {
              ...loan_application_internal,
              is_banding: loan_application_internal.is_banding ? 1 : 0,
              updated_at: now,
            });

            updatedLoanAppData = loan_application_internal;
            isUpdated = true;
          }
        }

        if (!isUpdated) {
          return {
            payload: {
              error: true,
              message: 'Tidak ada data yang diupdate',
              reference: 'NO_UPDATE_MADE',
              data: null,
            },
          };
        }

        // ============= UPDATE STATUS LOAN =================
        const loan = await this.loanAppRepo.findById(loanId!);
        if (!loan) {
          return {
            payload: {
              error: true,
              message: 'Loan tidak ditemukan',
              reference: 'LOAN_NOT_FOUND',
              data: null,
            },
          };
        }

        if (loan.status === StatusPengajuanEnum.REJECTED_SPV) {
          await this.loanAppRepo.updateLoanAppInternalStatus(
            loanId!,
            StatusPengajuanEnum.PENDING,
          );
        } else {
          return {
            payload: {
              error: true,
              message: 'Status tidak valid atau tidak dapat diproses',
              reference: 'INVALID_STATUS',
              data: null,
            },
          };
        }

        // ==================== RESPONSE FINAL =====================
        return {
          payload: {
            error: false,
            message: 'Pengajuan berhasil diupdate',
            reference: 'LOAN_UPDATE_OK',
            data: {
              filePaths,
              updatedFields: {
                ...updatedClientData,
                ...updatedAddressData,
                ...updatedFamilyData,
                ...updatedJobData,
                ...updatedLoanAppData,
                ...updatedCollateralData,
                ...updatedRelativeData,
              },
            },
          },
        };
      });
    } catch (err: any) {
      throw new BadRequestException(
        err.message ?? 'Gagal update pengajuan (internal error)',
      );
    }
  }
}
