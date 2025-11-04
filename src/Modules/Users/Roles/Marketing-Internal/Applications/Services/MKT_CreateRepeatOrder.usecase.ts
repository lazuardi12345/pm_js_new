import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
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
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';

@Injectable()
export class MKT_CreateRepeatOrderUseCase {
  private readonly logger = new Logger(MKT_CreateRepeatOrderUseCase.name);
  constructor(
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

  async execute(
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

        // ============== GET CLIENT INFO ==============
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
            repeatFromLoanId, // Pass kalau mau update, undefined kalau create new
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
