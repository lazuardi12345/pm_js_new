import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  IClientInternalRepository,
  CLIENT_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/client-internal.repository';
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

@Injectable()
export class MKT_UpdateLoanApplicationUseCase {
  private readonly baseFileUrl = 'http://192.182.6.69:3001/storage';

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
  ) { }

  private sanitizeName(name: string): string {
    return name?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown_client';
  }

  private getFileExtension(filename: string): string {
    const match = filename.match(/\.[0-9a-z]+$/i);
    return match ? match[0] : '';
  }

  async execute(
    payload: any,
    files: Record<string, Express.Multer.File[]>,
    clientId: number,
    marketingId?: number,
  ) {
    const now = new Date();

    try {
      return await this.uow.start(async () => {
        const {
          client_internal: clientInternal,
          address_internal: addressInternal,
          family_internal: familyInternal,
          job_internal: jobInternal,
          loan_application_internal: loanAppInternal,
          collateral_internal: collateralInternal,
          relative_internal: relativeInternal,
          isCompleted,
        } = payload;

        const client = await this.clientRepo.findById(clientId);
        if (!client) throw new BadRequestException('Client tidak ditemukan');

        // ==== PROSES FILE ====
        const filePaths: Record<string, string> = {};
        let isUpdated = false;

        if (files && Object.keys(files).length > 0) {
          const cleanName = this.sanitizeName(client.nama_lengkap);
          const folderPath = `${client.no_ktp}/${cleanName}`;
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
            if (!file) continue;
            if (!validFields.includes(fieldName)) {
              console.log(`Skip unknown file field: ${fieldName}`);
              continue;
            }

            const extension = this.getFileExtension(file.originalname);
            const formattedFileName = `${cleanName}-${fieldName}${extension}`;

            // Hapus file lama jika ada
            const oldFileUrl = client[fieldName];
            const oldFileName = oldFileUrl ? decodeURIComponent(oldFileUrl.split('/').pop()) : null;

            if (oldFileName) {
              await this.fileStorage.deleteFile(client.id!, cleanName, oldFileName);
            }

            // Simpan file baru
            await this.fileStorage.saveFiles(client.id!, cleanName, {
              [formattedFileName]: [file],
            });

            // Simpan path URL
            const newFilePath = `${this.baseFileUrl}/${client.no_ktp}/${cleanName}/${encodeURIComponent(formattedFileName)}`;

            filePaths[fieldName] = newFilePath;

            if (newFilePath !== oldFileUrl) {
              isUpdated = true;
            }
          }
        }

        // ==== UPDATE DATA CLIENT ====
        let updatedClientData = {};
        if (clientInternal || Object.keys(filePaths).length > 0) {
          updatedClientData = {
            ...clientInternal,
            foto_ktp: filePaths['foto_ktp'] ?? client.foto_ktp,
            foto_kk: filePaths['foto_kk'] ?? client.foto_kk,
            foto_id_card: filePaths['foto_id_card'] ?? client.foto_id_card,
            bukti_absensi_file: filePaths['bukti_absensi_file'] ?? client.bukti_absensi_file,
            foto_ktp_penjamin: filePaths['foto_ktp_penjamin'] ?? client.foto_ktp_penjamin,
            foto_id_card_penjamin: filePaths['foto_id_card_penjamin'] ?? client.foto_id_card_penjamin,
            foto_rekening: filePaths['foto_rekening'] ?? client.foto_rekening,
            updated_at: now,
          };

          // Hapus properti undefined supaya gak overwrite dengan undefined
          Object.keys(updatedClientData).forEach(key => {
            if (updatedClientData[key] === undefined) delete updatedClientData[key];
          });

          // Cek perubahan data client
          const hasClientChanged = Object.entries(updatedClientData).some(([key, val]) => {
            return client[key] !== val;
          });

          if (hasClientChanged) {
            await this.clientRepo.save({
              ...client,
              ...updatedClientData,
              isKtpValid: function (): boolean {
                throw new Error('Function not implemented.');
              },
              isMarriageStatusValid: function (): boolean {
                throw new Error('Function not implemented.');
              },
            });
            isUpdated = true;
          }
        }

        // ==== UPDATE ADDRESS ====
        let updatedAddressData = {};
        if (addressInternal && Object.keys(addressInternal).length > 0) {
          const existingAddress = await this.addressRepo.findById(client.id!);

          if (!existingAddress) {
            // Buat alamat baru
            await this.addressRepo.findByNasabahId({
              nasabah_id: client.id!,
              ...addressInternal,
              created_at: now,
              updated_at: now,
            });
            updatedAddressData = addressInternal;
            isUpdated = true;
          } else {
            // Pastikan existingAddress.id ada
            if (!existingAddress.id) {
              throw new BadRequestException('Address ID tidak ditemukan, update gagal');
            }
            await this.addressRepo.update(existingAddress.id, { ...addressInternal, updated_at: now });
            updatedAddressData = addressInternal;
            isUpdated = true;
          }
        }


        // ==== UPDATE FAMILY ====
        let updatedFamilyData = {};
        if (familyInternal && Object.keys(familyInternal).length > 0) {
          await this.familyRepo.update(client.id!, { ...familyInternal, updated_at: now });
          updatedFamilyData = familyInternal;
          isUpdated = true;
        }

        // ==== UPDATE JOB ====
        let updatedJobData = {};
        if (jobInternal && Object.keys(jobInternal).length > 0) {
          await this.jobRepo.update(client.id!, { ...jobInternal, updated_at: now });
          updatedJobData = jobInternal;
          isUpdated = true;
        }

        // ==== UPDATE LOAN APPLICATION ====
        let updatedLoanAppData = {};
        if (loanAppInternal && Object.keys(loanAppInternal).length > 0) {
          const loanApps = await this.loanAppRepo.findByNasabahId(client.id!);
          const loanApp = loanApps?.[0];
          if (loanApp) {
            await this.loanAppRepo.update(loanApp.id!, { ...loanAppInternal, updated_at: now });
            updatedLoanAppData = loanAppInternal;
            isUpdated = true;
          }
        }

        // ==== UPDATE COLLATERAL ====
        let updatedCollateralData = {};
        if (collateralInternal && Object.keys(collateralInternal).length > 0) {
          await this.collateralRepo.update(client.id!, { ...collateralInternal, updated_at: now });
          updatedCollateralData = collateralInternal;
          isUpdated = true;
        }

        // ==== UPDATE RELATIVE ====
        let updatedRelativeData = {};
        if (relativeInternal && Object.keys(relativeInternal).length > 0) {
          await this.relativeRepo.update(client.id!, { ...relativeInternal, updated_at: now });
          updatedRelativeData = relativeInternal;
          isUpdated = true;
        }

        if (!isUpdated) {
          throw new BadRequestException('Tidak ada data yang diupdate');
        }

        // Gabung semua data yang diupdate
        const updatedFields = {
          ...updatedClientData,
          ...updatedAddressData,
          ...updatedFamilyData,
          ...updatedJobData,
          ...updatedLoanAppData,
          ...updatedCollateralData,
          ...updatedRelativeData,
        };

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
      console.error('Error in MKT_UpdateLoanApplicationUseCase:', err);
      throw new BadRequestException(err.message || 'Gagal update pengajuan');
    }
  }
}
