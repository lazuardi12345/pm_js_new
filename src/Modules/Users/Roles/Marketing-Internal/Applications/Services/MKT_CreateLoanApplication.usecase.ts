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
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(dto: any, marketing_id: number) {
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

        // 1. Simpan Client dengan URL dari documents_files atau DTO langsung
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
            undefined,
            client_internal.email,
            documents_files?.foto_ktp ?? client_internal.foto_ktp ?? null,
            documents_files?.foto_kk ?? client_internal.foto_kk ?? null,
            documents_files?.foto_id_card ??
              client_internal.foto_id_card ??
              null,
            documents_files?.foto_rekening ??
              client_internal.foto_rekening ??
              null,
            client_internal.no_rekening,
            client_internal.enable_edit ?? false,
            client_internal.points ?? 0,
            now,
            now,
            null,
          ),
        );

        // 2. Simpan Address
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
            undefined,
            now,
            null,
            address_internal.status_rumah_ktp,
            address_internal.alamat_lengkap,
            now,
          ),
        );

        // 3. Simpan Family
        await this.familyRepo.save(
          new FamilyInternal(
            { id: customer.id! },
            family_internal.hubungan,
            family_internal.nama,
            family_internal.bekerja,
            undefined,
            undefined,
            undefined,
            family_internal.nama_perusahaan,
            family_internal.jabatan,
            family_internal.penghasilan,
            family_internal.alamat_kerja,
            family_internal.no_hp,
            undefined,
          ),
        );

        // 4. Simpan Job
        await this.jobRepo.save(
          new JobInternal(
            { id: customer.id! },
            job_internal.perusahaan,
            job_internal.divisi,
            job_internal.golongan,
            job_internal.nama_atasan,
            job_internal.nama_hrd,
            job_internal.absensi,
            undefined,
            undefined,
            undefined,
            job_internal.yayasan,
            job_internal.lama_kerja_bulan,
            job_internal.lama_kerja_tahun,
            documents_files?.bukti_absensi_file ??
              job_internal.bukti_absensi_file,
            undefined,
          ),
        );

        // 5. Simpan Loan Application (foto pendukung ambil dari DTO langsung)
        const foto_pendukung_url =
          loan_application_internal.foto_pendukung ?? null;

        const loanApp = await this.loanAppRepo.save(
          new LoanApplicationInternal(
            { id: customer.id! },
            loan_application_internal.status_pinjaman,
            loan_application_internal.nominal_pinjaman,
            loan_application_internal.tenor,
            loan_application_internal.keperluan,
            undefined,
            undefined,
            undefined,
            loan_application_internal.status,
            loan_application_internal.pinjaman_ke,
            loan_application_internal.riwayat_nominal,
            loan_application_internal.riwayat_tenor,
            loan_application_internal.sisa_pinjaman,
            loan_application_internal.notes,
            loan_application_internal.is_banding,
            loan_application_internal.alasan_banding,
          ),
        );

        // 6. Simpan Collateral dengan foto dari DTO langsung
        await this.collateralRepo.save(
          new CollateralInternal(
            { id: customer.id! },
            collateral_internal.jaminan_hrd,
            collateral_internal.jaminan_cg,
            collateral_internal.penjamin,
            undefined,
            undefined,
            undefined,
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
            documents_files?.foto_ktp_penjamin ??
              collateral_internal.foto_ktp_penjamin ??
              null,
            documents_files?.foto_id_card_penjamin ??
              collateral_internal.foto_id_card_penjamin ??
              null,
            undefined,
          ),
        );

        // 7. Simpan Relative jika ada
        if (relative_internal) {
          await this.relativeRepo.save(
            new RelativesInternal(
              { id: customer.id! },
              relative_internal.kerabat_kerja,
              undefined,
              relative_internal.nama,
              relative_internal.alamat,
              relative_internal.no_hp,
              relative_internal.status_hubungan,
              relative_internal.nama_perusahaan,
              undefined,
              undefined,
              undefined,
            ),
          );
        }

        // Return hasil sukses
        return {
          payload: {
            error: false,
            message: 'Pengajuan berhasil dibuat',
            reference: 'LOAN_CREATE_OK',
            data: {
              loanAppId: loanApp.id,
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
