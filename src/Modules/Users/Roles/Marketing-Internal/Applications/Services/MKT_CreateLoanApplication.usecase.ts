import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ClientInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/client-internal.entity';
import { AddressInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/address-internal.entity';
import { FamilyInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/family-internal.entity';
import { JobInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/job-internal.entity';
import { LoanApplicationInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/loan-application-internal.entity';
import { CollateralInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/collateral-internal.entity';
import { RelativesInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/relative-internal.entity';

// Repository Interfaces
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

// File Storage abstraction
import {
  IFileStorageRepository,
  FILE_STORAGE_SERVICE,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';

// Unit of Work abstraction
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';

@Injectable()
export class MKT_CreateLoanApplicationUseCase {
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
    private readonly uow: IUnitOfWork, // handle transaction + rollback
  ) {}

  async execute(dto: any, files: any, marketing_id: number) {
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
          relative_internal, // kalau memang mau dipakai
        } = dto;

        // 1. Simpan Clients
        const customer = await this.clientRepo.save(
          new ClientInternal(
            { id: marketing_id! },
            client_internal.nama_lengkap,
            client_internal.no_ktp,
            client_internal.jenis_kelamin,
            client_internal.tempat_lahir,
            new Date(client_internal.tanggal_lahir),
            client_internal.no_hp,
            client_internal.status_nikah,
            undefined, // id
            client_internal.email,
            client_internal.foto_ktp,
            client_internal.foto_kk,
            client_internal.foto_id_card,
            client_internal.foto_rekening,
            client_internal.no_rekening,
            client_internal.enable_edit ?? false,
            client_internal.points ?? 0,
            now,
            now,
            null,
          ),
        );

        // 2. Upload File kalau ada
        const filePaths = await this.fileStorage.saveFiles(
          customer.id!,
          customer.nama_lengkap,
          files,
        );

        customer.foto_ktp =
          filePaths['foto_ktp']?.[0]?.url ?? client_internal.foto_ktp ?? null;
        customer.foto_kk =
          filePaths['foto_kk']?.[0]?.url ?? client_internal.foto_kk ?? null;
        customer.foto_id_card =
          filePaths['foto_id_card']?.[0]?.url ??
          client_internal.foto_id_card ??
          null;
        customer.foto_rekening =
          filePaths['foto_rekening']?.[0]?.url ??
          client_internal.foto_rekening ??
          null;

        await this.clientRepo.save(customer);

        // 3. Address
        await this.addressRepo.save(
          new AddressInternal(
            { id: customer.id! },
            address_internal.alamat_ktp,
            address_internal.kelurahan,
            address_internal.rt_rw,
            address_internal.kecamatan,
            address_internal.kota,
            address_internal.provinsi,
            address_internal.domisili,
            address_internal.status_rumah_ktp,
            address_internal.status_rumah,
          ),
        );

        // 4. Family
        await this.familyRepo.save(
          new FamilyInternal(
            { id: customer.id! },
            family_internal.hubungan,
            family_internal.nama,
            family_internal.bekerja,
            family_internal.no_hp,
          ),
        );

        // 5. Job
        await this.jobRepo.save(
          new JobInternal(
            { id: customer.id! },
            job_internal.perusahaan,
            job_internal.divisi,
            job_internal.lama_kerja_tahun,
            job_internal.lama_kerja_bulan,
            job_internal.golongan,
            job_internal.nama_atasan,
            job_internal.nama_hrd,
            job_internal.absensi,
          ),
        );

        // 6. Loan Application
        const loanApp = await this.loanAppRepo.save(
          new LoanApplicationInternal(
            { id: customer.id! },
            loan_application_internal.status_pinjaman,
            loan_application_internal.nominal_pinjaman,
            loan_application_internal.tenor,
            loan_application_internal.keperluan,
            loan_application_internal.notes,
          ),
        );

        // 7. Collateral
        await this.collateralRepo.save(
          new CollateralInternal(
            { id: customer.id! },
            collateral_internal.jaminan_hrd,
            collateral_internal.jaminan_cg,
            collateral_internal.penjamin,
          ),
        );

        // 8. Relative (kalau memang mau dipakai ke tabel baru)
        if (relative_internal) {
          await this.relativeRepo.save(
            new RelativesInternal(
              { id: customer.id! },
              relative_internal.kerabat_kerja,
              relative_internal.nama,
              relative_internal.alamat,
              relative_internal.no_hp,
            ),
          );
        }

        return {
          payload: {
            error: false,
            message: 'Pengajuan berhasil dibuat',
            reference: 'LOAN_CREATE_OK',
            data: {
              loanAppId: loanApp.id,
              filePaths,
            },
          },
        };
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message || 'Gagal membuat pengajuan');
    }
  }
}
