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

  private extractFileNameFromUrl(url: string): string | null {
    if (!url) return null;
    try {
      const decoded = decodeURIComponent(url);
      return decoded.split('/').pop() ?? null;
    } catch {
      return null;
    }
  }

  async execute(
    payload: any,
    files: Record<string, Express.Multer.File[]>,
    clientId: number,
    marketingId: number,
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

        // 1. Ambil data client
        const client = await this.clientRepo.findById(clientId);
        if (!client) throw new BadRequestException('Client tidak ditemukan');

        // 2. Proses upload/update files
        // 2. Proses upload/update files
        const filePaths: Record<string, string> = {};
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

            // Ambil nama file lama dari URL
            const oldFileUrl = client[fieldName];
            const oldFileName = oldFileUrl ? oldFileUrl.split('/').pop() : undefined;

            if (oldFileName) {
              // Hapus file lama dulu
              await this.fileStorage.deleteFile(client.id!, cleanName, oldFileName);
            }

            // Simpan file baru dengan nama standar (overwrite jika ada)
            await this.fileStorage.saveFiles(client.id!, cleanName, { [formattedFileName]: [file] });

            // Update path/file URL di DB
            filePaths[fieldName] = `${this.baseFileUrl}/${client.no_ktp}/${cleanName}/${encodeURIComponent(formattedFileName)}`;
          }
        }


        // 3. Update client data dan file path
        if (clientInternal || Object.keys(filePaths).length > 0) {
          Object.assign(client, {
            ...clientInternal,

            foto_ktp: filePaths['foto_ktp'] ?? client.foto_ktp,
            foto_kk: filePaths['foto_kk'] ?? client.foto_kk,
            foto_id_card: filePaths['foto_id_card'] ?? client.foto_id_card,
            bukti_absensi_file: filePaths['bukti_absensi_file'] ?? client.bukti_absensi_file,
            foto_ktp_penjamin: filePaths['foto_ktp_penjamin'] ?? client.foto_ktp_penjamin,
            foto_id_card_penjamin: filePaths['foto_id_card_penjamin'] ?? client.foto_id_card_penjamin,
            foto_rekening: filePaths['foto_rekening'] ?? client.foto_rekening,

            updated_at: now,
          });
          await this.clientRepo.save(client);
        }

        // 4. Update Address
        if (addressInternal) {
          await this.addressRepo.update(client.id!, { ...addressInternal, updated_at: now });
        }

        // 5. Update Family
        if (familyInternal) {
          await this.familyRepo.update(client.id!, { ...familyInternal, updated_at: now });
        }

        // 6. Update Job
        if (jobInternal) {
          await this.jobRepo.update(client.id!, { ...jobInternal, updated_at: now });
        }

        // 7. Update Loan Application
        if (loanAppInternal) {
          const loanApps = await this.loanAppRepo.findByNasabahId(client.id!);
          const loanApp = loanApps?.[0];
          if (loanApp) {
            await this.loanAppRepo.update(loanApp.id!, { ...loanAppInternal, updated_at: now });
          }
        }

        // 8. Update Collateral
        if (collateralInternal) {
          await this.collateralRepo.update(client.id!, { ...collateralInternal, updated_at: now });
        }

        // 9. Update Relative
        if (relativeInternal) {
          await this.relativeRepo.update(client.id!, { ...relativeInternal, updated_at: now });
        }

        return {
          payload: {
            error: false,
            message: 'Pengajuan berhasil diupdate',
            reference: 'LOAN_UPDATE_OK',
            data: { filePaths },
          },
        };
      });
    } catch (err: any) {
      console.error('Error in MKT_UpdateLoanApplicationUseCase:', err);
      throw new BadRequestException(err.message || 'Gagal update pengajuan');
    }
  }
}
