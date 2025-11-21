import { Injectable, BadRequestException, Inject } from '@nestjs/common';

import {
  CLIENT_EXTERNAL_REPOSITORY,
  IClientExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external.repository';
import { ClientExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/client-external.entity';
import {
  ADDRESS_EXTERNAL_REPOSITORY,
  IAddressExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/address-external.repository';
import {
  IJobExternalRepository,
  JOB_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/job-external.repository';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  COLLATERAL_SHM_EXTERNAL_REPOSITORY,
  ICollateralBySHMRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-shm-external.repository';
import {
  COLLATERAL_BPJS_EXTERNAL_REPOSITORY,
  ICollateralByBPJSRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-bpjs-external.repository';
import {
  COLLATERAL_UMKM_REPOSITORY,
  ICollateralByUMKMRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-umkm.repository';
import {
  COLLATERAL_KEDINASAN_MOU_EXTERNAL_REPOSITORY,
  ICollateralByKedinasanMOURepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-kedinasan-mou-external.repository';
import {
  COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY,
  ICollateralByKedinasan_Non_MOU_Repository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-kedinasan-non-mou-external.repository';
import {
  IOtherExistLoansExternalRepository,
  OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/other-exist-loans-external.repository';
import {
  FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY,
  IFinancialDependentsExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/financial-dependents-external.repository';
import {
  ILoanGuarantorExternalRepository,
  LOAN_GUARANTOR_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loan-guarantor-external.repository';
import {
  COLLATERAL_BPKB_EXTERNAL_REPOSITORY,
  ICollateralByBPKBRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/collateral-bpkb-external.repository';
import { AddressExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/address-external.entity';
import { JobExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/job-external.entity';
import { LoanApplicationExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/loanApp-external.entity';
import { OtherExistLoansExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/other-exist-loans-external.entity';
import { FinancialDependentsExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/financial-dependents-external.entity';
import {
  EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
  IEmergencyContactExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/emergency-contact-external.repository';
import { EmergencyContactExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/emergency-contact-external.entity';
import { LoanGuarantorExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/loan-guarantor-external.entity';
import {
  CLIENT_EXTERNAL_PROFILE_REPOSITORY,
  IClientExternalProfileRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external-profile.repository';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { LoanApplicationExternalDto } from '../DTOS/MKT_CreateLoanApplicationExternal.dto';
import sharp from 'sharp';
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import {
  FILE_STORAGE_SERVICE,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import { UpdateOtherExistLoansExternalDto } from 'src/Modules/LoanAppExternal/Application/DTOS/dto-Other-Exist-Loans/update-other-exist-loans.dto';
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';
@Injectable()
export class MKT_UpdateLoanApplicationUseCase {
  private readonly baseFileUrl = `http://${process.env.BACKEND_URI}/storage`;

  constructor(
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly clientRepo: IClientExternalRepository,
    @Inject(CLIENT_EXTERNAL_PROFILE_REPOSITORY)
    private readonly clientProfileRepo: IClientExternalProfileRepository,
    @Inject(ADDRESS_EXTERNAL_REPOSITORY)
    private readonly addressRepo: IAddressExternalRepository,
    @Inject(JOB_EXTERNAL_REPOSITORY)
    private readonly jobRepo: IJobExternalRepository,
    @Inject(OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY)
    private readonly otherExistLoanRepo: IOtherExistLoansExternalRepository,
    @Inject(FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY)
    private readonly financialDependentRepo: IFinancialDependentsExternalRepository,
    @Inject(EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY)
    private readonly emergencyContactsRepo: IEmergencyContactExternalRepository,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(LOAN_GUARANTOR_EXTERNAL_REPOSITORY)
    private readonly loanGuarantorRepo: ILoanGuarantorExternalRepository,
    @Inject(COLLATERAL_SHM_EXTERNAL_REPOSITORY)
    private readonly collateralSHMRepo: ICollateralBySHMRepository,
    @Inject(COLLATERAL_BPJS_EXTERNAL_REPOSITORY)
    private readonly collateralBPJSRepo: ICollateralByBPJSRepository,
    @Inject(COLLATERAL_BPKB_EXTERNAL_REPOSITORY)
    private readonly collateralBPKBRepo: ICollateralByBPKBRepository,
    @Inject(COLLATERAL_UMKM_REPOSITORY)
    private readonly collateralUMKMRepo: ICollateralByUMKMRepository,
    @Inject(COLLATERAL_KEDINASAN_MOU_EXTERNAL_REPOSITORY)
    private readonly collateralKedinasanMOURepo: ICollateralByKedinasanMOURepository,
    @Inject(COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY)
    private readonly collateralKedinasanNonMOURepo: ICollateralByKedinasan_Non_MOU_Repository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
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
          client_external,
          client_external_profile,
          address_external,
          job_external,
          loan_application_external,
          emergency_contact_external,
          loan_guarantor_external,
          other_exist_loan_external,
          financial_dependents,
          collateral_bpjs,
          collateral_bpkb,
          collateral_kedinasan_mou,
          collateral_kedinasan_non_mou,
          collateral_shm,
          collateral_umkm,
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

            const prepareForClientName = client_external.nama_lengkap
              .trim()
              .replace(/\s+/g, '_');

            const prepareForClientId = Number(client_external.no_ktp);

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
                REQUEST_TYPE.INTERNAL,
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
        if (client_external || Object.keys(filePaths).length > 0) {
          const sanitized = {
            ...client_external,
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
          address_external,
          'Address',
        );

        const updatedJobData = await updateIfExist(
          this.jobRepo,
          job_external,
          'Job',
        );

        const updatedOtherExistLoanData = await updateIfExist(
          this.otherExistLoanRepo,
          other_exist_loan_external,
          'Other Exist Loan External',
        );

        const updatedFinancialDependentData = await updateIfExist(
          this.financialDependentRepo,
          financial_dependents,
          'Other Exist Loan External',
        );

        const updatedEmergencyContactsData = await updateIfExist(
          this.emergencyContactsRepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedLoanGuarantorData = await updateIfExist(
          this.loanGuarantorRepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedCollateralSHMData = await updateIfExist(
          this.collateralSHMRepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedCollateralBPJSData = await updateIfExist(
          this.collateralBPJSRepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedCollateralBPKBData = await updateIfExist(
          this.collateralBPKBRepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedCollateralUMKMData = await updateIfExist(
          this.collateralUMKMRepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedCollateralKedinasanMOUData = await updateIfExist(
          this.collateralKedinasanMOURepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        const updatedCollateralKedinasanNonMOUData = await updateIfExist(
          this.collateralKedinasanNonMOURepo,
          emergency_contact_external,
          'Other Exist Loan External',
        );

        // kolateral pakai file path jika ada
        //**?! */ if (collateral_internal) {
        //   ['foto_ktp_penjamin', 'foto_id_card_penjamin'].forEach((k) => {
        //     collateral_internal[k] = filePaths[k] ?? null;
        //   });
        //**?! */ }

        // ============= LOAN APPLICATION =================
        let updatedLoanAppData = {};
        if (
          loan_application_external &&
          Object.keys(loan_application_external).length > 0
        ) {
          const foundApps = await this.loanAppRepo.findByNasabahId(client.id!);
          const loanApp = foundApps?.[0];

          if (loanApp) {
            await this.loanAppRepo.update(loanApp.id!, {
              ...loan_application_external,
              is_banding: loan_application_external.is_banding ? 1 : 0,
              updated_at: now,
            });

            updatedLoanAppData = loan_application_external;
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

        if (loan.status_pengajuan === StatusPengajuanEnum.REVISI_SPV) {
          await this.loanAppRepo.updateLoanAppExternalStatus(
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
                ...updatedJobData,
                ...updatedOtherExistLoanData,
                ...updatedFinancialDependentData,
                ...updatedEmergencyContactsData,
                ...updatedLoanAppData,
                ...updatedLoanGuarantorData,
                ...updatedCollateralSHMData,
                ...updatedCollateralBPJSData,
                ...updatedCollateralBPKBData,
                ...updatedCollateralUMKMData,
                ...updatedCollateralKedinasanMOUData,
                ...updatedCollateralKedinasanNonMOUData,
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
