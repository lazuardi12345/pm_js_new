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
    private readonly uow: IUnitOfWork,
  ) { }

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
          relative_internal,
        } = dto;

        // 1. Simpan Client
        const customer = await this.clientRepo.save(
          new ClientInternal(
            { id: marketing_id },
            client_internal.nama_lengkap,
            client_internal.no_ktp,
            client_internal.jenis_kelamin,
            client_internal.tempat_lahir,
            new Date(client_internal.tanggal_lahir),
            client_internal.no_hp,
            client_internal.status_nikah,
            undefined, // id (auto)
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

        // 2. Upload file jika ada
        const filePaths = await this.fileStorage.saveFiles(
          customer.id!,
          customer.nama_lengkap,
          files,
        );

        // Update URL file hasil upload jika ada
        customer.foto_ktp = filePaths['foto_ktp']?.[0]?.url ?? customer.foto_ktp;
        customer.foto_kk = filePaths['foto_kk']?.[0]?.url ?? customer.foto_kk;
        customer.foto_id_card =
          filePaths['foto_id_card']?.[0]?.url ?? customer.foto_id_card;
        customer.foto_rekening =
          filePaths['foto_rekening']?.[0]?.url ?? customer.foto_rekening;

        await this.clientRepo.save(customer);

        // 3. Simpan Address
        await this.addressRepo.save(
          new AddressInternal(
            { id: customer.id! },
            address_internal.alamat_ktp,
            address_internal.rt_rw,
            address_internal.kelurahan,
            address_internal.kecamatan,
            address_internal.kota,
            address_internal.provinsi,
            address_internal.status_rumah,
            address_internal.domisili,
            undefined, // id
            now,
            null,
            address_internal.status_rumah_ktp,
            address_internal.alamat_lengkap,
            now,
          ),
        );

        // 4. Simpan Family
        await this.familyRepo.save(
          new FamilyInternal(
            { id: customer.id! },
            family_internal.hubungan,
            family_internal.nama,
            family_internal.bekerja,
            undefined, // id
            undefined, // created
            undefined, // deleted
            family_internal.nama_perusahaan,
            family_internal.jabatan,
            family_internal.penghasilan,
            family_internal.alamat_kerja,
            family_internal.no_hp,
            undefined,
          )
        );

        // 5. Simpan Job
        await this.jobRepo.save(
          new JobInternal(
            { id: customer.id! },
            job_internal.perusahaan,
            job_internal.divisi,
            job_internal.golongan,
            job_internal.nama_atasan,
            job_internal.nama_hrd,
            job_internal.absensi,
            undefined, // id
            undefined, // created
            undefined, // deleted
            job_internal.yayasan,
            job_internal.lama_kerja_bulan,
            job_internal.lama_kerja_tahun,
            job_internal.bukti_absensi,
            undefined // Update
          )
        );


        // 6. Simpan Loan Application
        const loanApp = await this.loanAppRepo.save(
          new LoanApplicationInternal(
            { id: customer.id! },
            loan_application_internal.status_pinjaman,
            loan_application_internal.nominal_pinjaman,
            loan_application_internal.tenor,
            loan_application_internal.keperluan,
            undefined, // id
            undefined, // created
            undefined, // updated
            loan_application_internal.status,
            loan_application_internal.pinjaman_ke,
            loan_application_internal.riwayat_nominal,
            loan_application_internal.riwayat_tenor,
            loan_application_internal.sisa_pinjaman,
            loan_application_internal.notes,
            loan_application_internal.is_banding,
            loan_application_internal.alasan_banding,
            undefined

          ),
        );


        // 7. Simpan Collateral
        await this.collateralRepo.save(
          new CollateralInternal(
            { id: customer.id! },
            collateral_internal.jaminan_hrd,
            collateral_internal.jaminan_cg,
            collateral_internal.penjamin,
            undefined, // id?
            undefined, // created_at?
            undefined, // deleted_at?
            collateral_internal.nama_penjamin,
            collateral_internal.lama_kerja_penjamin,
            collateral_internal.bagian,
            collateral_internal.absensi,
            collateral_internal.riwayat_pinjam_penjamin,
            collateral_internal.riwayat_nominal_penjamin,
            collateral_internal.riwayat_tenor_penjamin,
            collateral_internal.sisa_pinjaman_penjamin,
            collateral_internal.jaminan_cg_penjamin,
            collateral_internal.status_hubungan_penjamin,
            collateral_internal.foto_ktp_penjamin,
            collateral_internal.foto_id_card_penjamin,
            undefined
          ),
        );


        // 8. Simpan Relative (optional)
        if (relative_internal) {
          await this.relativeRepo.save(
            new RelativesInternal(
              { id: customer.id! },                 
              relative_internal.kerabat_kerja,      
              undefined,                            // id (kosong)
              relative_internal.nama,             
              relative_internal.alamat,             
              relative_internal.no_hp,              
              relative_internal.status_hubungan,
              relative_internal.nama_perusahaan,
              undefined,
              undefined,
              undefined
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
      console.error(err);
      throw new BadRequestException(err.message || 'Gagal membuat pengajuan');
    }
  }
}
