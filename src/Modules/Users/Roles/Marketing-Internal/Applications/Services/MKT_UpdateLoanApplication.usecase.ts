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
import { LoanInternalDto } from '../DTOS/MKT_CreateLoanApplication.dto';
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

        const foto_ktp_penjamin =
          files?.foto_ktp_penjamin?.[0]?.fieldname ?? null;

        console.log('PAYLOAD', {
          payload,
          clientId,
          marketingId,
          loanId,
          foto_ktp_penjamin,
        });

        const client = await this.clientRepo.findById(clientId);
        if (!client) throw new BadRequestException('Client tidak ditemukan');

        const filePaths: Record<string, string> = {};
        let isUpdated = false;

        if (files && Object.keys(files).length > 0) {
          //! buat bucket name di Minio
          const prepareForClientName = client.nama_lengkap
            .trim()
            .replace(/\s+/g, '_');
          const prepareForClientId = Number(client.no_ktp);
          // const folderPath = `${client.no_ktp}/${cleanName}`;
          const validFields = [
            'foto_ktp',
            'foto_kk',
            'foto_id_card',
            'bukti_absensi_file',
            'foto_ktp_penjamin',
            'foto_id_card_penjamin',
            'foto_rekening',
          ];

          for (const [fieldName, fileArray] of Object.entries(files)) {
            const file = fileArray?.[0];
            if (!file || !validFields.includes(fieldName)) continue;

            let processedBuffer = file.buffer;
            let newExtension = this.getFileExtension(file.originalname); // default
            const imageFields = [
              'foto_ktp',
              'foto_kk',
              'foto_id_card',
              'bukti_absensi_file',
              'foto_ktp_penjamin',
              'foto_id_card_penjamin',
              'foto_rekening',
            ];

            // jika file termasuk gambar, konversi ke .webp pakai sharp
            if (imageFields.includes(fieldName)) {
              processedBuffer = await sharp(file.buffer)
                .jpeg({ quality: 90 })
                .toBuffer();
              newExtension = '.jpeg';
            }

            const CleanClientName = client.nama_lengkap;
            const formattedFileName = `${CleanClientName}-${fieldName}${newExtension}.enc`;

            // upload pakai fileStorage
            await this.fileStorage.updateFile(
              prepareForClientId,
              prepareForClientName,
              formattedFileName,
              { ...file, buffer: processedBuffer }, // override buffer
              false,
            );

            const newFilePath = `${this.baseFileUrl}/${prepareForClientId}/${prepareForClientName}/${encodeURIComponent(formattedFileName)}`;
            filePaths[fieldName] = newFilePath;
            isUpdated = true;
          }
        }

        let updatedClientData = {};
        if (client_internal || Object.keys(filePaths).length > 0) {
          updatedClientData = {
            ...client_internal,
            ...filePaths,
            updated_at: now,
          };

          Object.keys(updatedClientData).forEach((key) => {
            const val = updatedClientData[key];

            if (val === undefined) {
              delete updatedClientData[key];
            }
            if (
              typeof val === 'object' &&
              val !== null &&
              Object.keys(val).length === 0
            ) {
              updatedClientData[key] = null;
            }
          });
          Object.keys(filePaths).forEach((key) => {
            if (!filePaths[key] || typeof filePaths[key] !== 'string') {
              updatedClientData[key] = null;
            }
          });

          const hasClientChanged = Object.entries(updatedClientData).some(
            ([key, val]) => client[key] !== val,
          );

          if (hasClientChanged) {
            await this.clientRepo.save({
              ...client,
              ...updatedClientData,
            } as ClientInternal);
            isUpdated = true;
          }
        }

        const updateIfExist = async (repo, data, clientField) => {
          if (!data || Object.keys(data).length === 0) return {};

          const existing = await repo.findById(clientId);
          const timestampedData = { ...data, updated_at: now };

          if (!existing) {
            await repo.save({
              ...data,
              nasabah: { id: clientId },
              createdAt: now,
              updatedAt: now,
            });
            isUpdated = true;
            return data;
          } else {
            if (!existing.id)
              throw new BadRequestException(
                `${clientField} ID tidak ditemukan, update gagal`,
              );
            await repo.update(existing.id, timestampedData);
            isUpdated = true;
            return data;
          }
        };

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
        const collateralFileKeys = [
          'foto_ktp_penjamin',
          'foto_id_card_penjamin',
        ];
        collateralFileKeys.forEach((key) => {
          if (filePaths[key] && typeof filePaths[key] === 'string') {
            collateral_internal[key] = filePaths[key]; // assign URL valid
          } else {
            collateral_internal[key] = null; // aman, bukan {}
          }
        });

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

        // Loan application (khusus karena pakai findByNasabahId)
        let updatedLoanAppData: Partial<LoanInternalDto> = {};

        if (
          loan_application_internal &&
          Object.keys(loan_application_internal).length > 0
        ) {
          const loanApps = await this.loanAppRepo.findByNasabahId(client.id!);
          const loanApp = loanApps?.[0];
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
          throw new BadRequestException('Tidak ada data yang diupdate');
        }

        const updatedFields = {
          ...updatedClientData,
          ...updatedAddressData,
          ...updatedFamilyData,
          ...updatedJobData,
          ...updatedLoanAppData,
          ...updatedCollateralData,
          ...updatedRelativeData,
        };

        const getLoan = await this.loanAppRepo.findById(loanId!);
        console.log('KUONTOLLLLLLL', getLoan?.status);
        const statusLoan = getLoan!.status;
        console.log('KUONTOLLLLLLL', statusLoan);

        switch (statusLoan) {
          case StatusPengajuanEnum.REJECTED_SPV:
            await this.loanAppRepo.updateLoanAppInternalStatus(
              loanId!,
              StatusPengajuanEnum.PENDING,
            );
            break;

          default:
            throw new BadRequestException(
              'Status tidak valid atau tidak dapat diproses',
            );
        }

        return {
          payload: {
            error: false,
            message: 'Pengajuan berhasil diupdate',
            reference: 'LOAN_UPDATE_OK',
            data: {
              filePaths,
              updatedFields,
            },
          },
        };
      });
    } catch (err: any) {
      console.log('errornya ayonima banget', err);
      console.error('Error in MKT_UpdateLoanApplicationUseCase:', err);
      throw new BadRequestException(err.message || 'Gagal update pengajuan');
    }
  }
}
