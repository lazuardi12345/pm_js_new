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
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';

interface UpdateResult {
  updated: boolean;
  data: any;
}

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

  async execute(
    payload: any,
    files: Record<string, Express.Multer.File[]>,
    clientId: number,
    marketingId?: number,
    loanId?: number,
  ) {
    if (!marketingId) {
      throw new BadRequestException('Marketing ID is required');
    }

    if (!loanId) {
      throw new BadRequestException('Loan ID is required');
    }

    return await this.uow.start(async () => {
      // ============= VALIDATE CLIENT & LOAN =============
      const client = await this.clientRepo.findById(clientId);
      if (!client?.id) {
        throw new BadRequestException('Client not found');
      }

      const loan = await this.loanAppRepo.findById(loanId);
      if (!loan?.id) {
        throw new BadRequestException('Loan application not found');
      }

      // VALIDATE STATUS - hanya bisa update jika status REJECTED_SPV
      if (loan.status !== StatusPengajuanEnum.REJECTED_SPV) {
        throw new BadRequestException(
          `Invalid loan status for update. Current status: ${loan.status}`,
        );
      }

      const {
        client_internal,
        address_internal,
        family_internal,
        job_internal,
        loan_application_internal,
        collateral_internal,
        relative_internal,
      } = payload;

      const updatedData: any = {};
      const changedFields: string[] = [];

      // ============= 1. HANDLE FILE UPLOADS (ONLY IF CHANGED) =============
      const uploadedFiles = await this.handleFileUploads(files, client);
      if (Object.keys(uploadedFiles).length > 0) {
        updatedData.files = uploadedFiles;
        changedFields.push(...Object.keys(uploadedFiles));
      }

      // ============= 2. UPDATE CLIENT =============
      const clientResult = await this.updateClient(
        client,
        client_internal,
        uploadedFiles,
      );
      if (clientResult.updated) {
        updatedData.client = clientResult.data;
        changedFields.push('client');
      }

      // ============= 3. UPDATE ENTITIES BY CLIENT ID =============
      const byClientResults = await Promise.all([
        this.updateByClientId(
          this.addressRepo,
          clientId,
          address_internal,
          'address',
        ),
        this.updateByClientId(
          this.familyRepo,
          clientId,
          family_internal,
          'family',
        ),
        this.updateByClientId(this.jobRepo, clientId, job_internal, 'job'),
        this.updateByClientId(
          this.relativeRepo,
          clientId,
          relative_internal,
          'relative',
        ),
      ]);

      byClientResults.forEach((result) => {
        if (result.updated) {
          Object.assign(updatedData, result.data);
          changedFields.push(Object.keys(result.data)[0]);
        }
      });

      // ============= 4. UPDATE COLLATERAL =============
      if (collateral_internal) {
        // Inject file paths jika ada
        ['foto_ktp_penjamin', 'foto_id_card_penjamin'].forEach((k) => {
          if (uploadedFiles[k]) {
            collateral_internal[k] = uploadedFiles[k];
          }
        });
      }

      const collateralResult = await this.updateByClientId(
        this.collateralRepo,
        clientId,
        collateral_internal,
        'collateral',
      );
      if (collateralResult.updated) {
        updatedData.collateral = collateralResult.data;
        changedFields.push('collateral');
      }

      // ============= 5. UPDATE LOAN APPLICATION =============
      const loanAppResult = await this.updateLoanApplication(
        loan,
        loan_application_internal,
      );
      if (loanAppResult.updated) {
        updatedData.loan_application = loanAppResult.data;
        changedFields.push('loan_application');
      }

      // ============= CHECK: ADA PERUBAHAN REAL? =============
      if (changedFields.length === 0) {
        throw new BadRequestException(
          'No changes detected - all data is identical',
        );
      }

      console.log('✅ CHANGES DETECTED:', changedFields);

      // ============= 6. UPDATE STATUS LOAN =================
      await this.loanAppRepo.updateLoanAppInternalStatus(
        loanId,
        StatusPengajuanEnum.PENDING,
      );

      // ==================== RESPONSE FINAL =====================
      return {
        payload: {
          error: false,
          message: 'Pengajuan berhasil diupdate',
          reference: 'LOAN_UPDATE_OK',
          data: {
            ...updatedData,
            changed_fields: changedFields,
          },
        },
      };
    });
  }

  /**
   * Handle file uploads - HANYA upload jika file baru berbeda dari existing
   */
  private async handleFileUploads(
    files: Record<string, Express.Multer.File[]>,
    client: any,
  ): Promise<Record<string, string>> {
    if (!files || Object.keys(files).length === 0) return {};

    const allowedFields = [
      'foto_ktp',
      'foto_kk',
      'foto_id_card',
      'bukti_absensi',
      'foto_ktp_penjamin',
      'foto_id_card_penjamin',
      'foto_rekening',
    ];

    const clientName = client.nama_lengkap.trim().replace(/\s+/g, '_');
    const clientNik = client.no_ktp;

    const uploadedPaths: Record<string, string> = {};

    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray?.[0];
      if (!file || !allowedFields.includes(fieldName)) continue;

      try {
        // Compress image
        const newBuffer = await sharp(file.buffer)
          .jpeg({ quality: 90 })
          .toBuffer();

        const existingUrl = client[fieldName];
        const identifier = existingUrl || clientNik.toString();

        const uploadedFile = await this.fileStorage.updateFile(
          identifier,
          clientName,
          fieldName,
          {
            ...file,
            buffer: newBuffer,
            originalname: `${fieldName}.jpeg`,
            mimetype: 'image/jpeg',
          },
          REQUEST_TYPE.INTERNAL,
        );

        // HANYA MASUKKAN KE RESULT KALO URL BARU BEDA DARI YANG LAMA
        if (uploadedFile.url !== existingUrl) {
          uploadedPaths[fieldName] = uploadedFile.url;
          console.log(
            `* File uploaded (NEW): ${fieldName} -> ${uploadedFile.url}`,
          );
        } else {
          console.log(`⏭️ File skipped (SAME): ${fieldName}`);
        }
      } catch (err) {
        throw new BadRequestException(
          `Failed to upload ${fieldName}: ${err.message}`,
        );
      }
    }

    return uploadedPaths;
  }

  /**
   * Update client - dengan deteksi perubahan
   */
  private async updateClient(
    client: any,
    data: any,
    uploadedFiles: Record<string, string>,
  ): Promise<UpdateResult> {
    const updates = { ...data, ...uploadedFiles };

    if (Object.keys(updates).length === 0) {
      return { updated: false, data: {} };
    }

    const cleanUpdates = this.cleanObject(updates);
    const changes = this.detectChanges(client, cleanUpdates);

    if (Object.keys(changes).length === 0) {
      console.log('> Client: No changes');
      return { updated: false, data: {} };
    }

    console.log('> Client CHANGED:', Object.keys(changes));

    // GUNAKAN UPDATE, BUKAN SAVE!
    await this.clientRepo.update(client.id, {
      ...changes,
      updated_at: new Date(),
    });

    return { updated: true, data: changes };
  }

  /**
   * Update entity by clientId - dengan deteksi perubahan dan NO DUPLICATE
   */
  private async updateByClientId(
    repo: any,
    clientId: number,
    data: any,
    name: string,
  ): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      return { updated: false, data: {} };
    }

    const existing = await repo.findById(clientId);
    const now = new Date();
    const cleanData = this.cleanObject(data);

    // Jika belum ada, CREATE
    if (!existing || !existing.id) {
      console.log(`> ${name}: Creating NEW record`);
      await repo.save({
        ...cleanData,
        nasabah: { id: clientId },
        created_at: now,
        updated_at: now,
      });
      return { updated: true, data: { [name]: cleanData } };
    }

    // Jika sudah ada, CEK PERUBAHAN
    const changes = this.detectChanges(existing, cleanData);

    if (Object.keys(changes).length === 0) {
      console.log(`> ${name}: No changes`);
      return { updated: false, data: {} };
    }

    console.log(
      `> ${name} CHANGED (ID: ${existing.id}):`,
      Object.keys(changes),
    );

    // GUNAKAN UPDATE, BUKAN SAVE!
    await repo.update(existing.id, {
      ...cleanData,
      updated_at: now,
    });

    return { updated: true, data: { [name]: cleanData } };
  }

  /**
   * Update loan application - dengan deteksi perubahan
   */
  private async updateLoanApplication(
    loan: any,
    data: any,
  ): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      return { updated: false, data: {} };
    }

    const cleanData = this.cleanObject({
      ...data,
      is_banding: data.is_banding ? 1 : 0,
    });

    const changes = this.detectChanges(loan, cleanData);

    if (Object.keys(changes).length === 0) {
      console.log('⏭️ Loan Application: No changes');
      return { updated: false, data: {} };
    }

    console.log(
      `> Loan Application CHANGED (ID: ${loan.id}):`,
      Object.keys(changes),
    );

    // GUNAKAN UPDATE, BUKAN SAVE!
    await this.loanAppRepo.update(loan.id, {
      ...cleanData,
      updated_at: new Date(),
    });

    return { updated: true, data: { loan_application: cleanData } };
  }

  /**
   * Clean object - hapus undefined, empty object, normalize dates
   */
  private cleanObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const cleaned = { ...obj };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === undefined) {
        delete cleaned[key];
      } else if (
        typeof cleaned[key] === 'object' &&
        cleaned[key] !== null &&
        !Array.isArray(cleaned[key]) &&
        Object.keys(cleaned[key]).length === 0
      ) {
        cleaned[key] = null;
      } else if (key.includes('tanggal') || key.includes('date')) {
        cleaned[key] = this.normalizeDateForMySQL(cleaned[key]);
      }
    });

    return cleaned;
  }

  /**
   * Normalize date untuk MySQL format
   */
  private normalizeDateForMySQL(value: any): string | null {
    if (!value) return null;

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return null;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch {
      return null;
    }
  }

  /**
   * Detect changes - bandingkan existing vs updates
   */
  private detectChanges(existing: any, updates: any): any {
    const ignoreKeys = [
      'nasabah',
      'pengajuan',
      'loanAppExternal',
      'otherExistLoan',
      'created_at',
      'updated_at',
      'id',
    ];

    const changes: any = {};

    Object.entries(updates).forEach(([key, newVal]) => {
      if (ignoreKeys.includes(key)) return;

      const oldVal = existing[key];
      const oldStr = JSON.stringify(oldVal);
      const newStr = JSON.stringify(newVal);

      if (oldStr !== newStr) {
        changes[key] = newVal;
      }
    });

    return changes;
  }
}
