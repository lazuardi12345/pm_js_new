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
  FileMetadata,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import { UpdateOtherExistLoansExternalDto } from 'src/Modules/LoanAppExternal/Application/DTOS/dto-Other-Exist-Loans/update-other-exist-loans.dto';
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';
import {
  DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY,
  IDetailInstallmentItemsExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/detail-installment-items-external.repository';
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
    @Inject(DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY)
    private readonly detailInstallmentRepo: IDetailInstallmentItemsExternalRepository,
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

    if (!marketingId) {
      throw new BadRequestException('Marketing ID is required');
    }

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
              'foto_ktp_peminjam',
              'foto_ktp_penjamin',
              'foto_kk_peminjam',
              'foto_rekening',
              'dokumen_pendukung',
              'foto_meteran_listrik',
              'foto_id_card_peminjam',
              'slip_gaji_peminjam',

              //? BPJS
              'foto_bpjs',
              'dokumen_pendukung_bpjs',

              //? SHM
              'foto_shm',
              'foto_kk_pemilik_shm',
              'foto_pbb',
              'foto_objek_jaminan',
              'foto_buku_nikah_suami_istri',
              'foto_npwp',
              'foto_imb',
              'foto_surat_ahli_waris',
              'foto_surat_akte_kematian',
              'foto_surat_pernyataan_kepemilikan_tanah',

              //? BPKB
              'foto_no_rangka',
              'foto_no_mesin',
              'foto_faktur_kendaraan',
              'foto_snikb',
              'dokumen_bpkb',
              'foto_stnk_depan',
              'foto_stnk_belakang',
              'foto_kendaraan_depan',
              'foto_kendaraan_belakang',
              'foto_kendaraan_samping_kanan',
              'foto_kendaraan_samping_kiri',
              'foto_sambara',
              'foto_kwitansi_jual_beli',
              'foto_ktp_tangan_pertama',
            ];

            const prepareForClientName = client.nama_lengkap
              .trim()
              .replace(/\s+/g, '_');

            const prepareForClientId = Number(client.nik);

            if (isNaN(prepareForClientId)) {
              throw new BadRequestException('Invalid client NIK');
            }

            for (const [fieldName, fileArray] of Object.entries(files)) {
              const file = fileArray?.[0];
              if (!file || !allowedFields.includes(fieldName)) continue;

              // Semua foto jadi JPEG, PDF tetap PDF
              let newBuffer = file.buffer;
              let fileExt = this.getFileExtension(file.originalname);

              if (fileExt.toLowerCase() === '.pdf') {
                // PDF ga diproses, langsung pass
                fileExt = '.pdf';
              } else {
                // Semua image jadi JPEG
                newBuffer = await sharp(file.buffer)
                  .jpeg({ quality: 90 })
                  .toBuffer();
                fileExt = '.jpeg';
              }

              // Ambil URL lama dari database
              const existingUrl =
                client_external?.[fieldName] || client?.[fieldName];

              let updatedFile: FileMetadata;

              if (existingUrl && typeof existingUrl === 'string') {
                updatedFile = await this.fileStorage.updateFile(
                  existingUrl,
                  prepareForClientName,
                  fieldName,
                  {
                    ...file,
                    buffer: newBuffer,
                    originalname: `${fieldName}${fileExt}`,
                  },
                  REQUEST_TYPE.EXTERNAL,
                );
              } else {
                updatedFile = await this.fileStorage.updateFile(
                  prepareForClientId.toString(),
                  prepareForClientName,
                  fieldName,
                  {
                    ...file,
                    buffer: newBuffer,
                    originalname: `${fieldName}${fileExt}`,
                  },
                  REQUEST_TYPE.EXTERNAL,
                );
              }

              filePaths[fieldName] = updatedFile.url;
              isUpdated = true;
            }
          }
        } catch (e) {
          console.error('File upload error:', e);
          throw new BadRequestException(
            `Gagal memproses file upload: ${e.message}`,
          );
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
        // ===============================
        // OEL + DETAIL INSTALLMENT FLOW
        // ===============================

        const saveOrUpdateOEL = async (
          loanId: number,
          data: any,
        ): Promise<OtherExistLoansExternal> => {
          const existing =
            await this.otherExistLoanRepo.findByLoanAppExternalId(loanId);

          let oel: OtherExistLoansExternal;

          if (!existing || existing.length === 0) {
            oel = await this.otherExistLoanRepo.save({
              ...data,
              loanAppExternal: { id: loanId },
            });
          } else {
            oel = await this.otherExistLoanRepo.update(existing[0].id!, {
              ...data,
              loanAppExternal: { id: loanId },
            });
          }

          return oel;
        };

        const replaceInstallmentItems = async (oelId: number, items: any[]) => {
          if (!Array.isArray(items)) return;

          const existingItems =
            await this.detailInstallmentRepo.findByOtherExistId(oelId);

          for (const item of existingItems) {
            await this.detailInstallmentRepo.delete(item.id!);
          }

          for (const item of items) {
            await this.detailInstallmentRepo.save({
              ...item,
              otherExistLoan: { id: oelId },
            });
          }
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

        let oel: OtherExistLoansExternal | null = null;
        let updatedOELData = {};
        let updatedDetailInstallments = [];

        if (
          other_exist_loan_external &&
          Object.keys(other_exist_loan_external).length > 0
        ) {
          oel = await saveOrUpdateOEL(loanId!, {
            cicilan_lain: other_exist_loan_external.cicilan_lain,
            validasi_pinjaman_lain:
              other_exist_loan_external.validasi_pinjaman_lain,
            catatan: other_exist_loan_external.catatan,
          });

          updatedOELData = {
            cicilan_lain: oel.cicilan_lain,
            validasi_pinjaman_lain: oel.validasi_pinjaman_lain,
            catatan: oel.catatan,
          };

          isUpdated = true;
        }

        if (
          oel &&
          Array.isArray(other_exist_loan_external?.detail_installment_items)
        ) {
          await replaceInstallmentItems(
            oel.id!,
            other_exist_loan_external.detail_installment_items,
          );

          updatedDetailInstallments =
            other_exist_loan_external.detail_installment_items;

          isUpdated = true;
        }

        const updatedFinancialDependentData = await updateIfExist(
          this.financialDependentRepo,
          financial_dependents,
          'Financial Dependents External',
        );

        const updatedEmergencyContactsData = await updateIfExist(
          this.emergencyContactsRepo,
          emergency_contact_external,
          'Emergency Contact External',
        );

        let updatedLoanGuarantorData = {};

        if (
          loan_guarantor_external &&
          Object.keys(loan_guarantor_external).length > 0
        ) {
          const existings =
            await this.loanGuarantorRepo.findByNasabahId(clientId);
          const existing = existings[0];

          const payload = {
            ...loan_guarantor_external,
            foto_ktp_penjamin:
              loan_guarantor_external.foto_ktp_penjamin ??
              client_external?.foto_ktp_penjamin ??
              existing?.foto_ktp_penjamin,
            updated_at: now,
          };

          if (!existing) {
            await this.loanGuarantorRepo.save({
              ...payload,
              nasabah: { id: clientId },
              created_at: now,
            });
          } else {
            await this.loanGuarantorRepo.update(existing.id!, payload);
          }

          updatedLoanGuarantorData = payload;
          isUpdated = true;
        }

        const updatedCollateralSHMData = await updateIfExist(
          this.collateralSHMRepo,
          collateral_shm,
          'Collateral SHM External',
        );

        const updatedCollateralBPJSData = await updateIfExist(
          this.collateralBPJSRepo,
          collateral_bpjs,
          'Collateral BPJS External',
        );

        const updatedCollateralBPKBData = await updateIfExist(
          this.collateralBPKBRepo,
          collateral_bpkb,
          'Collateral BPKB External',
        );

        const updatedCollateralUMKMData = await updateIfExist(
          this.collateralUMKMRepo,
          collateral_umkm,
          'Collateral UMKM External',
        );

        const updatedCollateralKedinasanMOUData = await updateIfExist(
          this.collateralKedinasanMOURepo,
          collateral_kedinasan_mou,
          'Collateral Kedinasan MOU External',
        );

        const updatedCollateralKedinasanNonMOUData = await updateIfExist(
          this.collateralKedinasanNonMOURepo,
          collateral_kedinasan_non_mou,
          'Collateral Kedinasan Non MOU External',
        );

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
                other_exist_loan_external: {
                  ...updatedOELData,
                  detail_installment_items: updatedDetailInstallments,
                },
              },
            },
          },
        };
      });
    } catch (err: any) {
      console.log(err);
      throw new BadRequestException(
        err.message ?? 'Gagal update pengajuan (internal error)',
      );
    }
  }
}
