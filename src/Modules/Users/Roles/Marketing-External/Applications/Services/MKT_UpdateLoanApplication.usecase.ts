import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  CLIENT_EXTERNAL_REPOSITORY,
  IClientExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external.repository';
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
import {
  EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
  IEmergencyContactExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/emergency-contact-external.repository';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import {
  FILE_STORAGE_SERVICE,
  FileMetadata,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';
import {
  DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY,
  IDetailInstallmentItemsExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/detail-installment-items-external.repository';
import sharp from 'sharp';
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';

interface UpdateResult {
  updated: boolean;
  data: any;
}

@Injectable()
export class MKT_UpdateLoanApplicationUseCase {
  constructor(
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly clientRepo: IClientExternalRepository,
    @Inject(ADDRESS_EXTERNAL_REPOSITORY)
    private readonly addressRepo: IAddressExternalRepository,
    @Inject(JOB_EXTERNAL_REPOSITORY)
    private readonly jobRepo: IJobExternalRepository,
    @Inject(OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY)
    private readonly oelRepo: IOtherExistLoansExternalRepository,
    @Inject(DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY)
    private readonly installmentRepo: IDetailInstallmentItemsExternalRepository,
    @Inject(FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY)
    private readonly financialDepRepo: IFinancialDependentsExternalRepository,
    @Inject(EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY)
    private readonly emergencyRepo: IEmergencyContactExternalRepository,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(LOAN_GUARANTOR_EXTERNAL_REPOSITORY)
    private readonly guarantorRepo: ILoanGuarantorExternalRepository,
    @Inject(COLLATERAL_SHM_EXTERNAL_REPOSITORY)
    private readonly shmRepo: ICollateralBySHMRepository,
    @Inject(COLLATERAL_BPJS_EXTERNAL_REPOSITORY)
    private readonly bpjsRepo: ICollateralByBPJSRepository,
    @Inject(COLLATERAL_BPKB_EXTERNAL_REPOSITORY)
    private readonly bpkbRepo: ICollateralByBPKBRepository,
    @Inject(COLLATERAL_UMKM_REPOSITORY)
    private readonly umkmRepo: ICollateralByUMKMRepository,
    @Inject(COLLATERAL_KEDINASAN_MOU_EXTERNAL_REPOSITORY)
    private readonly mouRepo: ICollateralByKedinasanMOURepository,
    @Inject(COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY)
    private readonly nonMouRepo: ICollateralByKedinasan_Non_MOU_Repository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
  ) {}

  async execute(
    payload: any,
    files: Record<string, Express.Multer.File[]>,
    clientId: number,
    marketingId?: number,
    loanId?: number,
  ) {
    if (!marketingId) throw new BadRequestException('Marketing ID required');
    if (!loanId) throw new BadRequestException('Loan ID required');

    return await this.uow.start(async () => {
      const client = await this.clientRepo.findById(clientId);
      if (!client?.id) {
        throw new BadRequestException('Client not found');
      }

      const loan = await this.loanAppRepo.findById(loanId);
      if (!loan?.id) {
        throw new BadRequestException('Loan application not found');
      }

      if (loan.status_pengajuan !== StatusPengajuanEnum.REVISI_SPV) {
        throw new BadRequestException('Invalid loan status for update');
      }

      const updatedData: any = {};
      const changedFields: string[] = [];

      // 1. HANDLE FILE UPLOADS (CEK BENERAN UPLOAD BARU)
      const uploadedFiles = await this.handleFileUploads(files, client);
      if (Object.keys(uploadedFiles).length > 0) {
        updatedData.files = uploadedFiles;
        changedFields.push(...Object.keys(uploadedFiles));
      }

      // 2. UPDATE CLIENT
      const clientResult = await this.updateClient(
        client,
        payload.client_external,
        uploadedFiles,
      );
      if (clientResult.updated) {
        updatedData.client = clientResult.data;
        changedFields.push('client');
      }

      // 3. UPDATE ENTITIES BY CLIENT ID
      const byClientResults = await Promise.all([
        this.updateByClientId(
          this.addressRepo,
          clientId,
          payload.address_external,
          'address',
        ),
        this.updateByClientId(
          this.jobRepo,
          clientId,
          payload.job_external,
          'job',
        ),
        this.updateByClientId(
          this.financialDepRepo,
          clientId,
          payload.financial_dependents,
          'financial_dependents',
        ),
        this.updateByClientId(
          this.emergencyRepo,
          clientId,
          payload.emergency_contact_external,
          'emergency_contact',
        ),
      ]);

      byClientResults.forEach((result) => {
        if (result.updated) {
          Object.assign(updatedData, result.data);
          changedFields.push(Object.keys(result.data)[0]);
        }
      });

      // 4. UPDATE LOAN GUARANTOR
      const guarantorResult = await this.updateGuarantor(
        clientId,
        client,
        payload.loan_guarantor_external,
        uploadedFiles.foto_ktp_penjamin,
      );
      if (guarantorResult.updated) {
        updatedData.guarantor = guarantorResult.data;
        changedFields.push('guarantor');
      }

      // 5. UPDATE COLLATERALS
      const collateralResults = await Promise.all([
        this.updateCollateral(
          this.shmRepo,
          loanId,
          payload.collateral_shm,
          'shm',
        ),
        this.updateCollateral(
          this.bpjsRepo,
          loanId,
          payload.collateral_bpjs,
          'bpjs',
        ),
        this.updateCollateral(
          this.bpkbRepo,
          loanId,
          payload.collateral_bpkb,
          'bpkb',
        ),
        this.updateCollateral(
          this.umkmRepo,
          loanId,
          payload.collateral_umkm,
          'umkm',
        ),
        this.updateCollateral(
          this.mouRepo,
          loanId,
          payload.collateral_kedinasan_mou,
          'mou',
        ),
        this.updateCollateral(
          this.nonMouRepo,
          loanId,
          payload.collateral_kedinasan_non_mou,
          'non_mou',
        ),
      ]);

      collateralResults.forEach((result) => {
        if (result.updated) {
          Object.assign(updatedData, result.data);
          changedFields.push(Object.keys(result.data)[0]);
        }
      });

      // 6. UPDATE OTHER EXISTING LOANS + INSTALLMENTS
      const oelResult = await this.updateOEL(
        loanId,
        payload.other_exist_loan_external,
      );
      if (oelResult.updated) {
        updatedData.other_exist_loan = oelResult.data;
        changedFields.push('other_exist_loan');
      }

      // 7. UPDATE LOAN APPLICATION
      const loanAppResult = await this.updateLoanApplication(
        loan,
        payload.loan_application_external,
      );
      if (loanAppResult.updated) {
        updatedData.loan_application = loanAppResult.data;
        changedFields.push('loan_application');
      }

      // CEK: ADA PERUBAHAN REAL GA?
      if (changedFields.length === 0) {
        throw new BadRequestException(
          'No changes detected - all data is identical',
        );
      }

      console.log('(*)(*) CHANGES DETECTED:', changedFields);

      // 8. UPDATE STATUS
      await this.loanAppRepo.updateLoanAppExternalStatus(
        loanId,
        StatusPengajuanEnum.PENDING,
      );

      return {
        payload: {
          error: false,
          message: 'Loan application updated successfully',
          reference: 'LOAN_UPDATE_OK',
          data: {
            ...updatedData,
            changed_fields: changedFields,
          },
        },
      };
    });
  }

  private async handleFileUploads(
    files: Record<string, Express.Multer.File[]>,
    client: any,
  ): Promise<Record<string, string>> {
    if (!files || Object.keys(files).length === 0) return {};

    const allowedFields = [
      'foto_ktp_peminjam',
      'foto_ktp_penjamin',
      'foto_kk_peminjam',
      'foto_rekening',
      'dokumen_pendukung',
      'foto_meteran_listrik',
      'foto_id_card_peminjam',
      'slip_gaji_peminjam',
      'foto_bpjs',
      'dokumen_pendukung_bpjs',
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

    const clientName = client.nama_lengkap.trim().replace(/\s+/g, '_');
    const clientNik = client.nik;

    const uploadedPaths: Record<string, string> = {};

    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray?.[0];
      if (!file || !allowedFields.includes(fieldName)) continue;

      try {
        const isPdf = file.originalname.toLowerCase().endsWith('.pdf');
        let buffer = file.buffer;
        let ext = isPdf ? '.pdf' : '.jpeg';

        if (!isPdf) {
          buffer = await sharp(file.buffer).jpeg({ quality: 90 }).toBuffer();
        }

        const existingUrl = client[fieldName];
        const identifier = existingUrl || clientNik.toString();

        const uploadedFile = await this.fileStorage.updateFile(
          identifier,
          clientName,
          fieldName,
          {
            ...file,
            buffer,
            originalname: `${fieldName}${ext}`,
          },
          REQUEST_TYPE.EXTERNAL,
        );

        // HANYA MASUKKAN KE RESULT KALO URL BARU BEDA DARI YANG LAMA
        if (uploadedFile.url !== existingUrl) {
          uploadedPaths[fieldName] = uploadedFile.url;
          console.log(
            `📤 File uploaded (NEW): ${fieldName} -> ${uploadedFile.url}`,
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
      console.log('⏭️ Client: No changes');
      return { updated: false, data: {} };
    }

    console.log('📝 Client CHANGED:', Object.keys(changes));
    await this.clientRepo.update(client.id, {
      ...changes,
      updated_at: new Date(),
    });

    return { updated: true, data: changes };
  }

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

    if (!existing || !existing.id) {
      console.log(`➕ ${name}: Creating NEW record`);
      await repo.save({
        ...cleanData,
        nasabah: { id: clientId },
        created_at: now,
        updated_at: now,
      });
      return { updated: true, data: { [name]: cleanData } };
    }

    const changes = this.detectChanges(existing, cleanData);

    if (Object.keys(changes).length === 0) {
      console.log(`⏭️ ${name}: No changes`);
      return { updated: false, data: {} };
    }

    console.log(
      `📝 ${name} CHANGED (ID: ${existing.id}):`,
      Object.keys(changes),
    );

    // UPDATE BUKAN SAVE ANJING!
    await repo.update(existing.id, {
      ...cleanData,
      updated_at: now,
    });

    return { updated: true, data: { [name]: cleanData } };
  }

  private async updateGuarantor(
    clientId: number,
    client: any,
    data: any,
    uploadedKtpPath?: string,
  ): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      return { updated: false, data: {} };
    }

    const existings = await this.guarantorRepo.findByNasabahId(clientId);
    const now = new Date();

    const cleanData = this.cleanObject({
      ...data,
      ...(uploadedKtpPath ? { foto_ktp_penjamin: uploadedKtpPath } : {}),
    });

    if (!existings || existings.length === 0) {
      console.log('➕ Guarantor: Creating NEW record');
      await this.guarantorRepo.save({
        ...cleanData,
        nasabah: client,
        created_at: now,
        updated_at: now,
      });
      await this.cleanupDuplicates(
        this.guarantorRepo,
        clientId,
        'findByNasabahId',
      );
      return { updated: true, data: { guarantor: cleanData } };
    }

    const existing = existings[0];
    if (!existing?.id) {
      console.error('❌ Guarantor: existing record has no ID');
      return { updated: false, data: {} };
    }

    const changes = this.detectChanges(existing, cleanData);

    if (Object.keys(changes).length === 0) {
      console.log('⏭️ Guarantor: No changes');
      await this.cleanupDuplicates(
        this.guarantorRepo,
        clientId,
        'findByNasabahId',
      );
      return { updated: false, data: {} };
    }

    console.log(
      `📝 Guarantor CHANGED (ID: ${existing.id}):`,
      Object.keys(changes),
    );

    // UPDATE BUKAN SAVE ANJING!
    await this.guarantorRepo.update(existing.id, {
      ...cleanData,
      updated_at: now,
    });

    await this.cleanupDuplicates(
      this.guarantorRepo,
      clientId,
      'findByNasabahId',
    );
    return { updated: true, data: { guarantor: cleanData } };
  }

  private async updateCollateral(
    repo: any,
    loanId: number,
    data: any,
    name: string,
  ): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      return { updated: false, data: {} };
    }

    const existings = await repo.findByPengajuanLuarId(loanId);
    const now = new Date();
    const cleanData = this.cleanObject(data);

    if (!existings || existings.length === 0) {
      console.log(`➕ Collateral ${name}: Creating NEW record`);
      await repo.save({
        ...cleanData,
        pengajuan: { id: loanId },
        created_at: now,
        updated_at: now,
      });
      return { updated: true, data: { [`collateral_${name}`]: cleanData } };
    }

    const existing = existings[0];
    if (!existing?.id) {
      console.error(`❌ Collateral ${name}: existing record has no ID`);
      return { updated: false, data: {} };
    }

    const changes = this.detectChanges(existing, cleanData);

    if (Object.keys(changes).length === 0) {
      console.log(`⏭️ Collateral ${name}: No changes`);
      await this.cleanupDuplicates(repo, loanId, 'findByPengajuanLuarId');
      return { updated: false, data: {} };
    }

    console.log(
      `📝 Collateral ${name} CHANGED (ID: ${existing.id}):`,
      Object.keys(changes),
    );

    // UPDATE BUKAN SAVE ANJING!
    await repo.update(existing.id, {
      ...cleanData,
      updated_at: now,
    });

    await this.cleanupDuplicates(repo, loanId, 'findByPengajuanLuarId');
    return { updated: true, data: { [`collateral_${name}`]: cleanData } };
  }

  private async updateOEL(loanId: number, data: any): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      return { updated: false, data: {} };
    }

    const existings = await this.oelRepo.findByLoanAppExternalId(loanId);
    const now = new Date();

    const { detail_installment_items, ...oelData } = data;
    const cleanOelData = this.cleanObject(oelData);

    let oelId: number;
    let hasOelChanges = false;

    if (!existings || existings.length === 0) {
      console.log('➕ OEL: Creating NEW record');
      const saved = await this.oelRepo.save({
        ...cleanOelData,
        loanAppExternal: { id: loanId },
        created_at: now,
        updated_at: now,
      });
      oelId = Number(saved.id);
      hasOelChanges = true;
    } else {
      const existing = existings[0];
      if (!existing?.id) {
        console.error(' OEL: existing record has no ID');
        return { updated: false, data: {} };
      }

      const changes = this.detectChanges(existing, cleanOelData);

      if (Object.keys(changes).length > 0) {
        console.log(`OEL CHANGED (ID: ${existing.id}):`, Object.keys(changes));

        await this.oelRepo.update(existing.id, {
          ...cleanOelData,
          updated_at: now,
        });
        hasOelChanges = true;
      }

      oelId = existing.id;
      await this.cleanupDuplicates(
        this.oelRepo,
        loanId,
        'findByLoanAppExternalId',
      );
    }

    // Handle installment items
    let hasInstallmentChanges = false;
    if (
      Array.isArray(detail_installment_items) &&
      detail_installment_items.length > 0
    ) {
      hasInstallmentChanges = await this.replaceInstallments(
        oelId,
        detail_installment_items,
      );
    }

    if (!hasOelChanges && !hasInstallmentChanges) {
      console.log('⏭️ OEL: No changes');
      return { updated: false, data: {} };
    }

    return {
      updated: true,
      data: {
        other_exist_loan: {
          ...cleanOelData,
          detail_installment_items: detail_installment_items || [],
        },
      },
    };
  }

  private async replaceInstallments(
    oelId: number,
    items: any[],
  ): Promise<boolean> {
    const existing = await this.installmentRepo.findByOtherExistId(oelId);

    // CEK: Apa installments beneran beda?
    const existingJson = JSON.stringify(
      existing
        .map((e) => ({
          nama_pembiayaan: e.nama_pembiayaan,
        }))
        .sort(),
    );

    const newJson = JSON.stringify(
      items
        .map((i) => ({
          nama_pembiayaan: i.nama_pembiayaan,
        }))
        .sort(),
    );

    if (existingJson === newJson) {
      console.log('⏭️ Installments: No changes');
      return false;
    }

    console.log('📝 Installments CHANGED');

    // Delete all existing
    for (const item of existing) {
      if (item?.id) await this.installmentRepo.delete(item.id);
    }

    // Insert new
    const now = new Date();
    for (const item of items) {
      await this.installmentRepo.save({
        ...item,
        otherExistLoan: { id: oelId },
        created_at: now,
        updated_at: now,
      });
    }

    return true;
  }

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
      `📝 Loan Application CHANGED (ID: ${loan.id}):`,
      Object.keys(changes),
    );

    // UPDATE BUKAN SAVE ANJING!
    await this.loanAppRepo.update(loan.id, {
      ...cleanData,
      updated_at: new Date(),
    });

    return { updated: true, data: { loan_application: cleanData } };
  }

  private async cleanupDuplicates(
    repo: any,
    id: number,
    findMethod: string,
  ): Promise<void> {
    const items = await repo[findMethod](id);
    if (items.length > 1) {
      console.log(`🧹 Cleaning up ${items.length - 1} duplicates`);
      for (let i = 1; i < items.length; i++) {
        if (items[i]?.id) await repo.delete(items[i].id);
      }
    }
  }

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
