import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

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

import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';

import { CreateLoanApplicationExternalDto } from '../DTOS/MKT_CreateLoanApplicationExternal.dto';
import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';

import {
  StatusRumahEnum,
  DomisiliEnum,
  RumahDomisiliEnum,
} from 'src/Shared/Enums/External/Address.enum';

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
import { DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY } from 'src/Shared/Modules/Drafts/Domain/Repositories/int/DraftRepeatOrder.repository';
import {
  CreateDraftRepeatOrderExtDto,
  PayloadExternalDTO,
} from 'src/Shared/Modules/Drafts/Applications/DTOS/RepeatOrderExt_MarketingInput/CreateRO_DraftRepeatOrder.dto';
import { MKT_GetDraftByMarketingId_ApprovalRecommendation } from 'src/Shared/Interface/MKT_GetDraft/MKT_GetDraftByMarketingId.interface';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import { RepeatOrderEntity } from 'src/Shared/Modules/Drafts/Domain/Entities/int/DraftRepeatOrder.entity';
import {
  CLIENT_EXTERNAL_PROFILE_REPOSITORY,
  IClientExternalProfileRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external-profile.repository';
import {
  EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
  IEmergencyContactExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/emergency-contact-external.repository';
import { AddressExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/address-external.entity';
import { JobExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/job-external.entity';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';
import { LoanApplicationExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/loanApp-external.entity';
import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { ClientExternalProfile } from 'src/Modules/LoanAppExternal/Domain/Entities/client-external-profile.entity';
import { CollateralByBPJS } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-bpjs-external.entity';
import { CollateralByBPKB } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-bpkb-external.entity';
import { CollateralByKedinasan_MOU } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-kedinasan-mou-external.entity';
import { CollateralByKedinasan_Non_MOU } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-kedinasan-non-mou-external.entity';
import { CollateralBySHM } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-shm-external.entity';
import { CollateralByUMKM } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-umkm.entity';
import {
  DRAFT_REPEAT_ORDER_EXTERNAL_REPOSITORY,
  IDraftRepeatOrderExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/DraftRepeatOrder.repository';
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';

@Injectable()
export class MKT_CreateRepeatOrderUseCase {
  private readonly logger = new Logger(MKT_CreateRepeatOrderUseCase.name);
  constructor(
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecommendationRepo: IApprovalRecommendationRepository,
    @Inject(DRAFT_REPEAT_ORDER_INTERNAL_REPOSITORY)
    private readonly repeatOrderRepo: IDraftRepeatOrderExternalRepository,
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

  async submitRepeatOrder(
    dto: CreateLoanApplicationExternalDto,
    client_id: number,
    files?: Record<string, Express.Multer.File[]>,
    repeatFromLoanId?: number,
  ) {
    const now = new Date();
    const nowWIB = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    try {
      return await this.uow.start(async () => {
        // --- 0. BASIC INPUT VALIDATION (prevent many mistakes early) ---
        if (!dto || typeof dto !== 'object') {
          throw new BadRequestException({
            payload: {
              error: true,
              message: 'Payload tidak valid',
              reference: 'INVALID_PAYLOAD',
            },
          });
        }

        const {
          client_external,
          address_external,
          job_external,
          loan_application_external,
          emergency_contact_external,
          loan_guarantor_external,
          other_exist_loan_external,
          financial_dependents_external,
          collateral_bpjs_external,
          collateral_bpkb_external,
          collateral_kedinasan_mou_external,
          collateral_kedinasan_non_mou_external,
          collateral_shm_external,
          collateral_umkm_external,
          documents_files,
          loan_external_type,
        } = dto;

        // Validate client-related required fields (adjust sesuai kebutuhan)
        if (
          !client_external ||
          !client_external.nik ||
          !client_external.nama_lengkap
        ) {
          throw new BadRequestException({
            payload: {
              error: true,
              message:
                'Data client_external tidak lengkap (no_ktp / nama_lengkap wajib).',
              reference: 'VALIDATION_client_external',
            },
          });
        }

        if (
          !loan_application_external ||
          typeof loan_application_external.nominal_pinjaman === 'undefined'
        ) {
          throw new BadRequestException({
            payload: {
              error: true,
              message: 'Data loan_application_external tidak lengkap.',
              reference: 'VALIDATION_LOAN_INTERNAL',
            },
          });
        }

        // optional: ensure NIK is numeric-ish for functions that rely on it
        const nikNumber = Number(client_external.nik);
        if (Number.isNaN(nikNumber)) {
          throw new BadRequestException({
            payload: {
              error: true,
              message: 'Nomor KTP tidak valid (harus angka).',
              reference: 'INVALID_NIK',
            },
          });
        }

        // --- 1. Pastikan client ada ---
        const customer = await this.clientRepo.findById(client_id);
        if (!customer) {
          throw new HttpException(
            {
              payload: {
                error: true,
                message: 'Client tidak ditemukan',
                reference: 'CLIENT_NOT_FOUND',
              },
            },
            HttpStatus.NOT_FOUND,
          );
        }

        // --- 2. Simpan AddressInternal ---
        try {
          const addressEntity = new AddressExternal(
            { id: customer.id! },
            address_external.alamat_ktp,
            address_external.rt_rw,
            address_external.kelurahan,
            address_external.kecamatan,
            address_external.kota,
            address_external.provinsi,
            address_external.status_rumah as StatusRumahEnum,
            address_external.domisili as DomisiliEnum,
            address_external.rumah_domisili as RumahDomisiliEnum,
            undefined,
            nowWIB,
            undefined,
            address_external.alamat_domisili,
            address_external.biaya_perbulan,
            address_external.biaya_pertahun,
            address_external.biaya_perbulan_domisili,
            address_external.biaya_pertahun_domisili,
            address_external.lama_tinggal,
            address_external.atas_nama_listrik,
            address_external.hubungan,
            address_external.foto_meteran_listrik,
            address_external.share_loc_domisili,
            address_external.share_loc_usaha,
            address_external.share_loc_tempat_kerja,
            address_external.validasi_alamat,
            nowWIB,
          );
          await this.addressRepo.save(addressEntity);
        } catch (e) {
          console.error('Error saving address:', e);
          // If DB connectivity problem => 503
          if (e?.code === 'ECONNREFUSED' || e?.name === 'MongoNetworkError') {
            throw new HttpException(
              {
                payload: {
                  error: true,
                  message: 'Database connection error saat menyimpan alamat',
                  reference: 'DB_CONNECTION_ERROR',
                },
              },
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }
          throw new HttpException(
            {
              payload: {
                error: true,
                message: 'Gagal menyimpan alamat nasabah',
                reference: 'ADDRESS_SAVE_ERROR',
              },
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // --- 4. Simpan JobInternal (bukti_absensi nanti di-update jika upload sukses) ---
        let jobEntity: JobExternal;
        try {
          jobEntity = new JobExternal(
            { id: customer.id! },
            job_external.perusahaan,
            job_external.alamat_perusahaan,
            job_external.kontak_perusahaan,
            job_external.jabatan!,
            job_external.lama_kerja!,
            job_external.status_karyawan! as StatusKaryawanEnum,
            job_external.pendapatan_perbulan,
            job_external.slip_gaji_peminjam,
            job_external.slip_gaji_penjamin,
            client_external.no_rek, //! kudu di cek lebih lanjut, gw cuma takut ini no rek PEKERJAAN bukan PRIBADI
            job_external.foto_id_card_peminjam,
            job_external.foto_id_card_penjamin,
            job_external.lama_kontrak,
            job_external.rekening_koran,
            job_external.validasi_pekerjaan,
            undefined,
            nowWIB,
            nowWIB,
            undefined,
          );
          await this.jobRepo.save(jobEntity);
        } catch (e) {
          console.error('Error saving job:', e);
          throw new HttpException(
            {
              payload: {
                error: true,
                message: 'Gagal menyimpan data pekerjaan',
                reference: 'JOB_SAVE_ERROR',
              },
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // --- 5. Simpan LoanApplicationInternal ---
        let loanApp: LoanApplicationExternal;
        try {
          const isBandingBoolean =
            loan_application_external.is_banding === 1 ? true : false;

          const loanAppEntity = new LoanApplicationExternal(
            { id: customer.id! },
            loan_application_external.jenis_pembiayaan as JenisPembiayaanEnum,
            loan_application_external.nominal_pinjaman ?? 0,
            loan_application_external.tenor ?? 0,
            loan_application_external.berkas_jaminan ?? '',
            loan_application_external.status_pinjaman,
            undefined,
            loan_application_external.pinjaman_ke,
            loan_application_external.pinjaman_terakhir,
            loan_application_external.sisa_pinjaman,
            loan_application_external.realisasi_pinjaman,
            loan_application_external.cicilan_perbulan,
            loan_application_external.status_pengajuan,
            null,
            loan_application_external.validasi_pengajuan,
            loan_application_external.catatan_spv,
            loan_application_external.catatan_marketing,
            isBandingBoolean,
            loan_application_external.alasan_banding,
            loan_application_external.survey_schedule,
            loan_application_external.draft_id,
            nowWIB,
            nowWIB,
            undefined,
          );

          loanApp = await this.loanAppRepo.save(loanAppEntity);
        } catch (e) {
          console.error('Error saving loan application:', e);
          // duplicate / constraint errors
          if (e?.code === 'ER_DUP_ENTRY' || e?.code === 11000) {
            throw new HttpException(
              {
                payload: {
                  error: true,
                  message: 'Terdeteksi duplikasi pengajuan',
                  reference: 'DUPLICATE_LOAN',
                },
              },
              HttpStatus.BAD_REQUEST,
            );
          }
          throw new HttpException(
            {
              payload: {
                error: true,
                message: 'Gagal menyimpan pengajuan',
                reference: 'LOAN_SAVE_ERROR',
              },
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        // ====================== FILES: CONVERT & UPLOAD ======================
        let minioUploadResult: any = null;
        const fileConversionErrors: Array<{
          field: string;
          name: string;
          error: any;
        }> = [];

        if (files && Object.keys(files).length > 0) {
          // Convert images to jpeg (best-effort). Kegagalan conversion tidak abort transaksi,
          // tapi kita catat dan fallback ke original buffer.
          for (const [field, fileArray] of Object.entries(files)) {
            if (!Array.isArray(fileArray)) continue;
            for (const file of fileArray) {
              try {
                if (file.mimetype && file.mimetype.startsWith('image/')) {
                  const outputBuffer = await sharp(file.buffer)
                    .jpeg({ quality: 100 })
                    .toBuffer();

                  file.buffer = outputBuffer;
                  file.originalname = file.originalname.replace(
                    /\.\w+$/,
                    '.jpeg',
                  );
                  file.mimetype = 'image/jpeg';
                  this.logger.log(
                    `Converted ${file.originalname} (${field}) to JPEG`,
                  );
                }
              } catch (convErr) {
                // jangan throw — log & simpan info (so we can retry manual)
                console.error(
                  'Image conversion failed for',
                  file.originalname,
                  convErr,
                );
                fileConversionErrors.push({
                  field,
                  name: file.originalname,
                  error: convErr,
                });
                // leave original buffer as-is
              }
            }
          }

          // Upload ke Minio (atau service storage). Harus tangani hasilnya.
          try {
            minioUploadResult = await this.fileStorage.saveRepeatOrderFiles(
              nikNumber,
              client_external.nama_lengkap,
              files,
              REQUEST_TYPE.EXTERNAL, // ← Sesuai pattern baru
            );

            // Basic sanity checks on result
            if (!minioUploadResult || typeof minioUploadResult !== 'object') {
              throw new Error('Invalid upload result from fileStorage');
            }

            // Check if any field has files
            const hasFiles = Object.values(minioUploadResult).some(
              (fileArray) => Array.isArray(fileArray) && fileArray.length > 0,
            );

            if (!hasFiles) {
              throw new Error('No files were uploaded successfully');
            }

            // Optional: Log metadata untuk tracking
            console.log('RO Files uploaded:', {
              customerId: nikNumber,
              customerName: client_external.nama_lengkap,
              loanId: loanApp.id,
              nasabahId: client_id,
              filesUploaded: Object.keys(minioUploadResult).length,
            });
          } catch (uploadErr) {
            console.error('File upload failed:', uploadErr);

            // Jika storage down, kita pertimbangkan sebagai SERVICE_UNAVAILABLE supaya operator aware
            throw new HttpException(
              {
                payload: {
                  error: true,
                  message: 'Gagal mengunggah file ke storage',
                  reference: 'FILE_UPLOAD_ERROR',
                  details:
                    fileConversionErrors.length > 0
                      ? { conversionErrors: fileConversionErrors.length }
                      : undefined,
                },
              },
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }
        }

        // ====================== MAP TO PROFILE AND UPDATE JOB ======================
        try {
          const clientProfileEntity = new ClientExternalProfile(
            { id: customer.id! },
            { id: loanApp.id! },
            client_external.nama_lengkap,
            client_external.no_rek,
            client_external.jenis_kelamin as GENDER,
            client_external.no_hp,
            client_external.status_nikah,
            undefined,
            client_external.email,
            client_external.foto_rekening,
            client_external.foto_ktp_peminjam,
            client_external.foto_ktp_penjamin,
            client_external.foto_kk_peminjam,
            client_external.foto_kk_penjamin,
            client_external.dokumen_pendukung,
            client_external.validasi_nasabah,
            client_external.catatan,
            false,
            nowWIB,
            nowWIB,
            undefined,
          );
          await this.clientProfileRepo.save(clientProfileEntity);
        } catch (e) {
          console.error('Error saving client profile:', e);
          throw new HttpException(
            {
              payload: {
                error: true,
                message: 'Gagal menyimpan profil nasabah',
                reference: 'PROFILE_SAVE_ERROR',
              },
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // Update job entity with bukti_absensi kalau ada
        try {
          // if (minioUploadResult?.savedFiles?.bukti_absensi && jobEntity) {
          //   jobEntity.bukti_absensi =
          //     minioUploadResult.savedFiles.bukti_absensi[0].url;
          //   await this.jobRepo.save(jobEntity);
          // }
        } catch (e) {
          console.error('Error updating job bukti_absensi:', e);
          // jangan abort seluruh proses kalau update bukti gagal — log saja
        }

        // ====================== COLLATERAL ======================

        // try {
        //   const collEntity = new CollateralInternal(
        //     { id: client_id! },
        //     collateral_internal.jaminan_hrd,
        //     collateral_internal.jaminan_cg,
        //     collateral_internal.penjamin as PenjaminEnum,
        //     undefined,
        //     undefined,
        //     undefined,
        //     collateral_internal.nama_penjamin,
        //     collateral_internal.lama_kerja_penjamin!,
        //     collateral_internal.bagian!,
        //     collateral_internal.absensi_penjamin!,
        //     collateral_internal.riwayat_pinjam_penjamin as RiwayatPinjamPenjaminEnum,
        //     collateral_internal.riwayat_nominal_penjamin!,
        //     collateral_internal.riwayat_tenor_penjamin!,
        //     collateral_internal.sisa_pinjaman_penjamin!,
        //     collateral_internal.jaminan_cg_penjamin!,
        //     collateral_internal.status_hubungan_penjamin!,
        //     minioUploadResult?.savedFiles?.foto_ktp_penjamin?.[0]?.url ??
        //       parseFileUrl(documents_files?.foto_ktp_penjamin ?? null),
        //     minioUploadResult?.savedFiles?.foto_id_card_penjamin?.[0]?.url ??
        //       parseFileUrl(documents_files?.foto_id_card_penjamin ?? null),
        //     undefined,
        //   );
        //   await this.collateralRepo.save(collEntity);
        // } catch (e) {
        //   console.error('Error saving collateral:', e);
        //   throw new HttpException(
        //     {
        //       payload: {
        //         error: true,
        //         message: 'Gagal menyimpan data jaminan',
        //         reference: 'COLLATERAL_SAVE_ERROR',
        //       },
        //     },
        //     HttpStatus.BAD_REQUEST,
        //   );
        // }

        switch (loan_external_type) {
          case 'BPJS': {
            try {
              const coll_BPJS_Entity = new CollateralByBPJS(
                { id: loanApp.id! },
                collateral_bpjs_external.saldo_bpjs,
                collateral_bpjs_external.tanggal_bayar_terakhir,
                collateral_bpjs_external.username,
                collateral_bpjs_external.password,
                collateral_bpjs_external.foto_bpjs,
                collateral_bpjs_external.jaminan_tambahan,
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              );
              await this.collateralBPJSRepo.save(coll_BPJS_Entity);
            } catch (e) {
              console.error('Error saving collateral:', e);
              throw new HttpException(
                {
                  payload: {
                    error: true,
                    message: 'Gagal menyimpan data jaminan BPJS',
                    reference: 'COLLATERAL_BPJS_SAVE_ERROR',
                  },
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
          case 'BPKB': {
            try {
              const coll_BPKB_Entity = new CollateralByBPKB(
                { id: loanApp.id! },
                collateral_bpkb_external.atas_nama_bpkb,
                collateral_bpkb_external.no_stnk,
                collateral_bpkb_external.alamat_pemilik_bpkb,
                collateral_bpkb_external.type_kendaraan,
                collateral_bpkb_external.tahun_perakitan,
                collateral_bpkb_external.warna_kendaraan,
                collateral_bpkb_external.stransmisi,
                collateral_bpkb_external.no_rangka,
                collateral_bpkb_external.foto_no_rangka,
                collateral_bpkb_external.no_mesin,
                collateral_bpkb_external.foto_no_mesin,
                collateral_bpkb_external.no_bpkb,
                collateral_bpkb_external.dokumen_bpkb,
                collateral_bpkb_external.foto_stnk_depan,
                collateral_bpkb_external.foto_stnk_belakang,
                collateral_bpkb_external.foto_kendaraan_depan,
                collateral_bpkb_external.foto_kendaraan_belakang,
                collateral_bpkb_external.foto_kendaraan_samping_kanan,
                collateral_bpkb_external.foto_kendaraan_samping_kiri,
                collateral_bpkb_external.foto_sambara,
                collateral_bpkb_external.foto_kwitansi_jual_beli,
                collateral_bpkb_external.foto_ktp_tangan_pertama,
                collateral_bpkb_external.foto_faktur_kendaraan,
                collateral_bpkb_external.foto_snikb,
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              );
              await this.collateralBPKBRepo.save(coll_BPKB_Entity);
            } catch (e) {
              console.error('Error saving collateral:', e);
              throw new HttpException(
                {
                  payload: {
                    error: true,
                    message: 'Gagal menyimpan data jaminan BPKB',
                    reference: 'COLLATERAL_BPKB_SAVE_ERROR',
                  },
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
          case 'KEDINASAN_MOU': {
            try {
              const coll_KEDINASAN_MOU_Entity = new CollateralByKedinasan_MOU(
                { id: loanApp.id! },
                collateral_kedinasan_mou_external.instansi,
                collateral_kedinasan_mou_external.surat_permohonan_kredit,
                collateral_kedinasan_mou_external.surat_pernyataan_penjamin,
                collateral_kedinasan_mou_external.surat_persetujuan_pimpinan,
                collateral_kedinasan_mou_external.surat_keterangan_gaji,
                collateral_kedinasan_mou_external.foto_form_pengajuan,
                collateral_kedinasan_mou_external.foto_surat_kuasa_pemotongan,
                collateral_kedinasan_mou_external.foto_surat_pernyataan_peminjam,
                collateral_kedinasan_mou_external.foto_sk_golongan_terbaru,
                collateral_kedinasan_mou_external.foto_keterangan_tpp,
                collateral_kedinasan_mou_external.foto_biaya_operasional,
                collateral_kedinasan_mou_external.foto_surat_kontrak,
                collateral_kedinasan_mou_external.foto_rekomendasi_bendahara,
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              );
              await this.collateralKedinasanMOURepo.save(
                coll_KEDINASAN_MOU_Entity,
              );
            } catch (e) {
              console.error('Error saving collateral:', e);
              throw new HttpException(
                {
                  payload: {
                    error: true,
                    message: 'Gagal menyimpan data jaminan Kedinasan MOU',
                    reference: 'COLLATERAL_KEDINASAN_MOU_SAVE_ERROR',
                  },
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
          case 'KEDINASAN_NON_MOU': {
            try {
              const coll_KEDINASAN_NON_MOU_Entity =
                new CollateralByKedinasan_Non_MOU(
                  { id: loanApp.id! },
                  collateral_kedinasan_non_mou_external.instansi,
                  collateral_kedinasan_non_mou_external.surat_permohonan_kredit,
                  collateral_kedinasan_non_mou_external.surat_pernyataan_penjamin,
                  collateral_kedinasan_non_mou_external.surat_persetujuan_pimpinan,
                  collateral_kedinasan_non_mou_external.surat_keterangan_gaji,
                  collateral_kedinasan_non_mou_external.foto_surat_kontrak,
                  collateral_kedinasan_non_mou_external.foto_keterangan_tpp,
                  collateral_kedinasan_non_mou_external.foto_biaya_operasional,
                  undefined,
                  nowWIB,
                  nowWIB,
                  undefined,
                );
              await this.collateralKedinasanNonMOURepo.save(
                coll_KEDINASAN_NON_MOU_Entity,
              );
            } catch (e) {
              console.error('Error saving collateral:', e);
              throw new HttpException(
                {
                  payload: {
                    error: true,
                    message: 'Gagal menyimpan data jaminan Kedinasan non MOU',
                    reference: 'COLLATERAL_KEDINASAN_NON_MOU_SAVE_ERROR',
                  },
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
          case 'SHM': {
            try {
              const coll_SHM_Entity = new CollateralBySHM(
                { id: loanApp.id! },
                collateral_shm_external.atas_nama_shm,
                collateral_shm_external.hubungan_shm,
                collateral_shm_external.alamat_shm,
                collateral_shm_external.luas_shm,
                collateral_shm_external.njop_shm,
                collateral_shm_external.foto_shm,
                collateral_shm_external.foto_kk_pemilik_shm,
                collateral_shm_external.foto_pbb,
                collateral_shm_external.foto_objek_jaminan,
                collateral_shm_external.foto_buku_nikah_suami_istri,
                collateral_shm_external.foto_npwp,
                collateral_shm_external.foto_imb,
                collateral_shm_external.foto_surat_ahli_waris,
                collateral_shm_external.foto_surat_akte_kematian,
                collateral_shm_external.foto_surat_pernyataan_kepemilikan_tanah,
                collateral_shm_external.foto_surat_pernyataan_tidak_dalam_sengketa,
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              );
              await this.collateralSHMRepo.save(coll_SHM_Entity);
            } catch (e) {
              console.error('Error saving collateral:', e);
              throw new HttpException(
                {
                  payload: {
                    error: true,
                    message: 'Gagal menyimpan data jaminan SHM',
                    reference: 'COLLATERAL_SHM_SAVE_ERROR',
                  },
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
          case 'UMKM': {
            try {
              const coll_UMKM_Entity = new CollateralByUMKM(
                { id: loanApp.id! },
                collateral_umkm_external.foto_sku,
                collateral_umkm_external.foto_usaha,
                collateral_umkm_external.foto_pembukuan,
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              );
              await this.collateralUMKMRepo.save(coll_UMKM_Entity);
            } catch (e) {
              console.error('Error saving collateral:', e);
              throw new HttpException(
                {
                  payload: {
                    error: true,
                    message: 'Gagal menyimpan data jaminan UMKM',
                    reference: 'COLLATERAL_SAVE_ERROR_UMKM',
                  },
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
        }
        // ====================== RELATIVES (optional) ======================
        // try {
        //   if (relative_internal) {
        //     const relEntity = new RelativesInternal(
        //       { id: client_id! },
        //       relative_internal.kerabat_kerja as KerabatKerjaEnum,
        //       undefined,
        //       relative_internal.nama,
        //       relative_internal.alamat,
        //       relative_internal.no_hp,
        //       relative_internal.status_hubungan!,
        //       relative_internal.nama_perusahaan!,
        //       undefined,
        //       undefined,
        //       undefined,
        //     );
        //     await this.relativeRepo.save(relEntity);
        //   }
        // } catch (e) {
        //   console.error('Error saving relatives:', e);
        //   // optional — tidak fatal
        // }

        // --- Done: build response ---
        return {
          payload: {
            error: false,
            message: minioUploadResult?.isUpdate
              ? `Repeat Order ke-${minioUploadResult.originalLoanId} berhasil dibuat`
              : 'Pengajuan repeat berhasil dibuat',
            reference: 'REPEAT_ORDER_CREATE_OK',
            data: {
              loanAppId: loanApp.id,
              clientId: client_id,
              isUpdate: minioUploadResult?.isUpdate ?? false,
              isRepeatOrder: !!repeatFromLoanId,
              pengajuanFolder: minioUploadResult?.pengajuanFolder ?? null,
              originalLoanId: minioUploadResult?.originalLoanId ?? null,
              filesUploaded: minioUploadResult?.savedFiles
                ? Object.keys(minioUploadResult.savedFiles).length
                : 0,
              fileConversionErrorsCount: fileConversionErrors.length,
            },
          },
        };
      });
    } catch (err) {
      console.error('Error in CreateRepeatOrderUseCase:', err);

      // Kalau error sudah HttpException (our own) → lempar apa adanya
      if (err instanceof HttpException) throw err;

      // DB connection down
      if (err?.code === 'ECONNREFUSED' || err?.name === 'MongoNetworkError') {
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

      // Storage / Minio error fallback
      if (
        err?.message?.includes?.('storage') ||
        err?.message?.toLowerCase?.().includes('upload')
      ) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Service storage sedang bermasalah',
              reference: 'STORAGE_SERVICE_ERROR',
            },
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Fallback general (400)
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err?.message || 'Gagal membuat repeat order',
            reference: 'REPEAT_ORDER_CREATE_ERROR',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async executeCreateRepeatOrder(
    dto: PayloadExternalDTO,
    client_id: number,
    marketingId: number, // ← Tambah parameter marketing_id
    files?: Record<string, Express.Multer.File[]>,
    repeatFromLoanId?: number,
  ) {
    try {
      let minioUploadResult;

      // ============== ASSIGN marketing_id ke DTO ==============
      dto.marketing_id = marketingId;

      // ============== LOG REQUEST INFO ==============
      console.log('=== Create Draft Repeat Order ===');
      console.log('Marketing ID:', marketingId);
      console.log('Client ID:', client_id);
      console.log('Repeat From Loan ID:', repeatFromLoanId);
      console.log('Files received:', files ? Object.keys(files) : 'No files');
      console.log('Payload preview:', {
        nama: dto.client_external?.nama_lengkap,
        nik: dto.client_external?.nik,
        nominal: dto.loan_application_external?.nominal_pinjaman,
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

        // ============== SAVE FILES PAKAI saveRepeatOrderFiles ==============
        minioUploadResult = await this.fileStorage.saveRepeatOrderFiles(
          Number(dto.client_external.nik),
          dto.client_external.nama_lengkap,
          files,
          REQUEST_TYPE.EXTERNAL,
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
        // if (savedFiles.bukti_absensi?.[0]?.url && dto.job_internal) {
        //   dto.job_internal.bukti_absensi = savedFiles.bukti_absensi[0].url;
        //   console.log('✓ Assigned bukti_absensi URL to job_internal');
        // }

        // // File penjamin ke collateral_internal (kalau ada)
        // if (savedFiles.foto_ktp_penjamin?.[0]?.url && dto.collateral_internal) {
        //   dto.collateral_internal.foto_ktp_penjamin =
        //     savedFiles.foto_ktp_penjamin[0].url;
        //   console.log(
        //     '✓ Assigned foto_ktp_penjamin URL to collateral_internal',
        //   );
        // }
        // if (
        //   savedFiles.foto_id_card_penjamin?.[0]?.url &&
        //   dto.collateral_internal
        // ) {
        //   dto.collateral_internal.foto_id_card_penjamin =
        //     savedFiles.foto_id_card_penjamin[0].url;
        //   console.log(
        //     '✓ Assigned foto_id_card_penjamin URL to collateral_internal',
        //   );
        // }
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
        dto.loan_application_external?.nominal_pinjaman ?? 0,
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
            client_external: loanApp.client_external,
            loan_application_external: loanApp.loan_application_external,
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

      // =================== HANDLE MONGOOSE VALIDATION ERROR ===================
      if (err?.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((e: any) => e.message)
          .join(', ');

        throw new HttpException(
          {
            payload: {
              error: true,
              message,
              reference: 'LOAN_VALIDATION_ERROR',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // =================== HANDLE DUPLICATE KEY ERROR ===================
      if (err?.code === 11000) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`,
              reference: 'LOAN_DUPLICATE_KEY',
              duplicatedFields: err.keyValue,
            },
          },
          HttpStatus.CONFLICT,
        );
      }

      // =================== HANDLE MINIO / FILE SYSTEM ERRORS ===================
      if (err?.isMinioError) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: err.message || 'File storage error',
              reference: 'MINIO_FILE_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // =================== HANDLE SHARP IMAGE PROCESSING ERRORS ===================
      if (err?.message?.includes('Sharp')) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Image processing failed',
              reference: 'IMAGE_PROCESSING_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // =================== GENERIC ERROR (FALLBACK) ===================
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err.message || 'Unexpected server error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async renderRepeatOrderByMarketingId(marketingId: number) {
    try {
      // ================= VALIDASI PARAMETER =================
      if (
        marketingId === null ||
        marketingId === undefined ||
        Number.isNaN(Number(marketingId))
      ) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Invalid marketing ID',
              reference: 'INVALID_MARKETING_ID',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ================= QUERY DRAFT BERDASARKAN MARKETING =================
      const loanApps =
        await this.repeatOrderRepo.findByMarketingId(marketingId);

      if (!loanApps || loanApps.length === 0) {
        return {
          payload: {
            error: false,
            message: 'No draft loan applications found for this marketing ID',
            reference: 'LOAN_NOT_FOUND',
          },
        };
      }

      // ================= BUILD RESPONSE =================
      type DraftWithRecommendation = (typeof loanApps)[number] & {
        approval_recommendation:
          | MKT_GetDraftByMarketingId_ApprovalRecommendation
          | {
              error: boolean | string;
              message: string;
              reference: string;
            }
          | {
              dont_have_check: true;
            };
      };

      const processedLoans: DraftWithRecommendation[] = [];

      for (const loanApp of loanApps) {
        try {
          if (!loanApp) {
            console.warn('LoanApp item is NULL, skipping.');
            continue;
          }

          const nominalPinjaman =
            loanApp?.loan_application_external?.nominal_pinjaman ?? 0;

          let approvalRecommendation: any;

          // ================= BI CHECKING NEEDED =================
          if (nominalPinjaman >= 7000000) {
            const draftId = loanApp._id?.toString();

            if (!draftId) {
              approvalRecommendation = {
                error: true,
                message: 'Draft ID missing',
                reference: 'DRAFT_ID_MISSING',
              };
            } else {
              try {
                const recommendation =
                  await this.approvalRecommendationRepo.findByDraftId(draftId);

                if (recommendation) {
                  approvalRecommendation = {
                    draft_id: recommendation.draft_id!,
                    nama_nasabah: recommendation.nama_nasabah!,
                    recommendation: recommendation.recommendation!,
                    filePath: recommendation.filePath!,
                    catatan: recommendation.catatan ?? null,
                  };
                } else {
                  approvalRecommendation = {
                    error: true,
                    message: 'Waiting Admin BI Responsibility',
                    reference: 'WAITING_ADMIN_BI_RECOMMENDATION',
                  };
                }
              } catch (recError) {
                console.error(
                  'Error while fetching BI recommendation:',
                  recError,
                );

                approvalRecommendation = {
                  error: true,
                  message: 'Failed fetching BI recommendation',
                  reference: 'RECOMMENDATION_FETCH_FAILED',
                };
              }
            }
          } else {
            // ================= BI CHECKING NOT REQUIRED =================
            approvalRecommendation = {
              dont_have_check: true,
            };
          }

          processedLoans.push({
            ...loanApp,
            approval_recommendation: approvalRecommendation,
          });
        } catch (innerError) {
          console.error('Error processing individual loanApp:', innerError);

          processedLoans.push({
            ...loanApp,
            approval_recommendation: {
              error: true,
              message: 'Failed processing draft item',
              reference: 'DRAFT_PROCESSING_FAILED',
            },
          });
        }
      }

      // ================= RETURN SUCCESS RESPONSE =================
      return {
        payload: {
          error: false,
          message: 'Draft loan applications retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: processedLoans,
        },
      };
    } catch (error) {
      console.error('=== ERROR renderDraftByMarketingId ===');
      console.error(error);

      // Explicit HttpException
      if (error instanceof HttpException) {
        throw error;
      }

      // Mongo connection failure
      if (error?.name === 'MongoNetworkError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database connection failure',
              reference: 'DB_CONNECTION_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Mongoose CastError (ObjectId invalid)
      if (error?.name === 'CastError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Invalid data format',
              reference: 'INVALID_DATA_FORMAT',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // General unexpected error
      throw new HttpException(
        {
          payload: {
            error: true,
            message: error.message || 'Unexpected error',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRepeatOrderById(
    Id: string,
    updateData: Partial<CreateDraftRepeatOrderExtDto>,
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

        filePaths = await this.fileStorage.saveFiles(
          Number(payload?.client_external?.nik) ?? Id,
          payload?.client_external?.nama_lengkap ?? `draft-${Id}`,
          files,
        );

        for (const [field, paths] of Object.entries(filePaths)) {
          if (paths && paths.length > 0) {
            // Tentukan di object mana field ini berada
            const parentKeys = [
              'client_external',
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

  async renderRepeatOrderById(Id: string) {
    try {
      // ========== 1. VALIDASI INPUT ==========
      if (Id === null || Id === undefined || String(Id).trim() === '') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Draft ID is required',
              reference: 'INVALID_DRAFT_ID',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // ========== 2. AMBIL DARI REPO ==========
      let loanApp;
      try {
        loanApp = await this.repeatOrderRepo.findById(Id);
      } catch (repoErr) {
        console.error('Error calling repeatOrderRepo.findById:', repoErr);

        // Database connectivity / network
        if (
          repoErr?.name === 'MongoNetworkError' ||
          repoErr?.code === 'ECONNREFUSED'
        ) {
          throw new HttpException(
            {
              payload: {
                error: true,
                message: 'Database connection error while retrieving draft',
                reference: 'DB_CONNECTION_ERROR',
              },
            },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        // Mongoose CastError (invalid ObjectId)
        if (repoErr?.name === 'CastError') {
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

        // Jika repositori melempar error lain, bungkus jadi 500 (tidak spill stack)
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Failed to retrieve draft from repository',
              reference: 'REPO_READ_ERROR',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // ========== 3. CEK RESULT ==========
      if (!loanApp) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'No draft loan application found for this ID',
              reference: 'LOAN_NOT_FOUND',
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const sanitizedLoanApp = { ...loanApp };

      // ========== 5. RETURN SUCCESS (konsisten payload) ==========
      return {
        payload: {
          error: false,
          message: 'Draft loan application retrieved',
          reference: 'LOAN_RETRIEVE_OK',
          data: {
            client_and_loan_detail: sanitizedLoanApp,
          },
        },
      };
    } catch (error) {
      console.error('=== ERROR renderDraftById ===');
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }
      if (
        error?.name === 'MongoNetworkError' ||
        error?.code === 'ECONNREFUSED'
      ) {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Database connection failure',
              reference: 'DB_CONNECTION_ERROR',
            },
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Invalid cast / ObjectId format (if not caught earlier)
      if (error?.name === 'CastError') {
        throw new HttpException(
          {
            payload: {
              error: true,
              message: 'Invalid data format',
              reference: 'INVALID_DATA_FORMAT',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generic fallback (don't leak internals)
      throw new HttpException(
        {
          payload: {
            error: true,
            message: 'Unexpected error while retrieving draft',
            reference: 'LOAN_UNKNOWN_ERROR',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRepeatOrderByMarketingId(id: string) {
    try {
      const deleteResult = await this.repeatOrderRepo.softDelete(id);

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
