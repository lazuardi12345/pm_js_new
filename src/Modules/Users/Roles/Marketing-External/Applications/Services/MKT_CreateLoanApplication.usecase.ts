import {
  Injectable,
  BadRequestException,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';

import { CreateLoanApplicationExternalDto } from '../DTOS/MKT_CreateLoanApplicationExternal.dto';
import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/External/Client-External.enum';

import {
  StatusRumahEnum,
  DomisiliEnum,
  RumahDomisiliEnum,
} from 'src/Shared/Enums/External/Address.enum';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';

import { JenisPembiayaanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
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
import { ClientExternalProfile } from 'src/Modules/LoanAppExternal/Domain/Entities/client-external-profile.entity';
import { CollateralByBPJS } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-bpjs-external.entity';
import { CollateralByBPKB } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-bpkb-external.entity';
import { CollateralByKedinasan_MOU } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-kedinasan-mou-external.entity';
import { CollateralByKedinasan_Non_MOU } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-kedinasan-non-mou-external.entity';
import { CollateralBySHM } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-shm-external.entity';
import { CollateralByUMKM } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-umkm.entity';
import {
  DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY,
  IDetailInstallmentItemsExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/detail-installment-items-external.repository';
import { DetailInstallmentItemsExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/detail-installment-items-external.entity';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

@Injectable()
export class MKT_CreateLoanApplicationUseCase {
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
    private readonly detailInstallmentItemsRepo: IDetailInstallmentItemsExternalRepository,
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
  ) {}

  async execute(dto: CreateLoanApplicationExternalDto, marketing_id: number) {
    const now = new Date();
    const nowWIB = new Date(now.getTime() + 7 * 60 * 60 * 1000);

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
          documents_files,
          type,
        } = dto;

        // ==========================
        // 1. VALIDASI BASIC
        // ==========================
        if (!client_external?.nama_lengkap) {
          throw new BadRequestException({
            payload: {
              error: true,
              message: 'Nama lengkap wajib diisi',
              reference: 'VALIDATION_ERROR',
            },
          });
        }

        if (!client_external?.nik) {
          throw new BadRequestException({
            payload: {
              error: true,
              message: 'Nomor KTP wajib diisi',
              reference: 'VALIDATION_ERROR',
            },
          });
        }

        // ==========================
        // 2. CEK NIK - PAKAI YANG ADA ATAU BUAT BARU
        // ==========================
        const formattedNik = Number(client_external.nik);
        let customer = await this.clientRepo.findByKtp(formattedNik);

        if (!customer) {
          // NIK BARU - Buat client baru
          try {
            const client = new ClientExternal(
              { id: marketing_id },
              client_external.nama_lengkap,
              Number(client_external.nik),
              client_external.no_kk,
              client_external.tempat_lahir,
              new Date(client_external.tanggal_lahir),
              undefined,
              0,
              nowWIB,
              nowWIB,
              null,
            );

            customer = await this.clientRepo.save(client);
          } catch (e) {
            console.error('Error saving client:', e);

            if (e?.code === 'ER_DUP_ENTRY' || e?.code === 11000) {
              throw new BadRequestException({
                payload: {
                  error: true,
                  message: 'Nomor KTP sudah terdaftar',
                  reference: 'KTP_DUPLICATE',
                },
              });
            }

            throw new HttpException(
              {
                payload: {
                  error: true,
                  message: 'Gagal menyimpan data nasabah',
                  reference: 'CLIENT_SAVE_ERROR',
                },
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
        // ELSE: customer udah ada, langsung pake aja!

        // ==========================
        // 3. SIMPAN SEMUA DATA LAIN (TETEP INSERT)
        // ==========================
        await this.addressRepo.save(
          new AddressExternal(
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
            parseFileUrl(
              documents_files?.foto_meteran_listrik ??
                address_external.foto_meteran_listrik ??
                null,
            ),
            address_external.share_loc_domisili,
            address_external.share_loc_usaha,
            address_external.share_loc_tempat_kerja,
            address_external.validasi_alamat,
            nowWIB,
          ),
        );

        await this.jobRepo.save(
          new JobExternal(
            { id: customer.id! },
            job_external.perusahaan,
            job_external.alamat_perusahaan,
            job_external.kontak_perusahaan,
            job_external.jabatan!,
            job_external.lama_kerja!,
            job_external.status_karyawan! as StatusKaryawanEnum,
            job_external.pendapatan_perbulan,
            parseFileUrl(
              documents_files?.slip_gaji_peminjam ??
                job_external.slip_gaji_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.slip_gaji_penjamin ??
                job_external.slip_gaji_penjamin ??
                null,
            ),
            client_external_profile.no_rek, //! kudu di cek lebih lanjut, gw cuma takut ini no rek PEKERJAAN bukan PRIBADI
            parseFileUrl(
              documents_files?.id_card_peminjam ??
                job_external.id_card_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.id_card_penjamin ??
                job_external.id_card_penjamin ??
                null,
            ),
            job_external.lama_kontrak,
            parseFileUrl(
              documents_files?.rekening_koran ??
                job_external.rekening_koran ??
                null,
            ),
            job_external.validasi_pekerjaan,
            undefined,
            nowWIB,
            nowWIB,
            undefined,
            // job_external.yayasan!,
            // parseFileUrl(
            //   documents_files?.bukti_absensi_file ??
            //     job_external.bukti_absensi ??
            //     null,
            // ),
            // undefined,
          ),
        );

        // ==========================
        // 4. LOAN APPLICATION (BARU)
        // ==========================
        const isBandingBoolean =
          loan_application_external.is_banding === 1 ? true : false;

        const loanApp = await this.loanAppRepo.save(
          new LoanApplicationExternal(
            { id: customer.id! },
            loan_application_external.jenis_pembiayaan as JenisPembiayaanEnum,
            loan_application_external.nominal_pinjaman ?? 0,
            loan_application_external.tenor ?? 0,
            parseFileUrl(
              documents_files?.berkas_jaminan ??
                loan_application_external.berkas_jaminan ??
                null,
            ),
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
            nowWIB,
            nowWIB,
            undefined,
          ),
        );

        await this.clientProfileRepo.save(
          new ClientExternalProfile(
            { id: customer.id! },
            { id: loanApp.id! },
            client_external_profile.nama_lengkap,
            client_external_profile.no_rek,
            client_external_profile.jenis_kelamin as GENDER,
            client_external_profile.no_hp,
            client_external_profile.status_nikah,
            undefined,
            client_external_profile.email,
            parseFileUrl(
              documents_files?.foto_rekening ??
                client_external_profile.foto_rekening ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_ktp_peminjam ??
                client_external_profile.foto_ktp_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_ktp_penjamin ??
                client_external_profile.foto_ktp_penjamin ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_kk_peminjam ??
                client_external_profile.foto_kk_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_kk_penjamin ??
                client_external_profile.foto_kk_penjamin ??
                null,
            ),
            parseFileUrl(
              documents_files?.dokumen_pendukung ??
                client_external_profile.dokumen_pendukung ??
                null,
            ),
            client_external_profile.validasi_nasabah,
            client_external_profile.catatan,
            false,
            nowWIB,
            nowWIB,
            undefined,
          ),
        );

        if (dto?.isHaveInstallment && dto.other_exist_loan_external.cicilan) {
          const otherDto = dto.other_exist_loan_external;

          const cicilanLainEnum =
            dto.isHaveInstallment && otherDto.cicilan?.length
              ? otherDto.cicilan[0].cicilan_lain
              : CicilanLainEnum.TIDAK;

          const parent = new OtherExistLoansExternal(
            { id: loanApp.id! },
            cicilanLainEnum,
            undefined,
            otherDto.validasi_pinjaman_lain,
            otherDto.catatan,
            new Date(),
            new Date(),
            undefined,
          );

          const savedParent = await this.otherExistLoanRepo.save(parent);

          // Save children parallel
          if (otherDto.cicilan && otherDto.cicilan.length > 0) {
            await Promise.all(
              otherDto.cicilan.map((loan) => {
                const detailInstallment = new DetailInstallmentItemsExternal(
                  { id: savedParent.id! },
                  loan.nama_pembiayaan,
                  Number(loan.total_pinjaman),
                  Number(loan.cicilan_perbulan),
                  Number(loan.sisa_tenor),
                );

                return this.detailInstallmentItemsRepo.save(detailInstallment);
              }),
            );
          }
        } else {
          const parent = new OtherExistLoansExternal(
            { id: loanApp.id! },
            CicilanLainEnum.TIDAK,
            undefined,
            undefined,
            undefined,
            new Date(),
            new Date(),
            undefined,
          );

          await this.otherExistLoanRepo.save(parent);
        }

        await this.financialDependentRepo.save(
          new FinancialDependentsExternal(
            { id: customer.id! },
            financial_dependents.kondisi_tanggungan,
            financial_dependents.validasi_tanggungan,
            undefined,
            nowWIB,
            nowWIB,
            undefined,
          ),
        );

        await this.emergencyContactsRepo.save(
          new EmergencyContactExternal(
            { id: customer.id! },
            emergency_contact_external.nama_kontak_darurat,
            emergency_contact_external.hubungan_kontak_darurat,
            emergency_contact_external.no_hp_kontak_darurat,
            emergency_contact_external.validasi_kontak_darurat,
            undefined,
            nowWIB,
            nowWIB,
            undefined,
          ),
        );

        await this.loanGuarantorRepo.save(
          new LoanGuarantorExternal(
            { id: customer.id! },
            loan_guarantor_external.hubungan_penjamin,
            loan_guarantor_external.nama_penjamin,
            loan_guarantor_external.pekerjaan_penjamin,
            loan_guarantor_external.penghasilan_penjamin,
            loan_guarantor_external.no_hp_penjamin,
            loan_guarantor_external.persetujuan_penjamin,
            parseFileUrl(
              documents_files?.foto_ktp_penjamin ??
                loan_guarantor_external.foto_ktp_penjamin ??
                null,
            ),
            undefined,
            loan_guarantor_external.validasi_penjamin,
            nowWIB,
            nowWIB,
            undefined,
          ),
        );

        switch (type) {
          // ==========================
          // 1. BPJS
          // ==========================
          case 'BPJS': {
            await this.collateralBPJSRepo.save(
              new CollateralByBPJS(
                { id: loanApp.id! },
                collateral_bpjs.saldo_bpjs,
                collateral_bpjs.tanggal_bayar_terakhir,
                collateral_bpjs.username,
                collateral_bpjs.password,
                parseFileUrl(
                  documents_files?.foto_bpjs ??
                    collateral_bpjs.foto_bpjs ??
                    null,
                ),
                collateral_bpjs.jaminan_tambahan,
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              ),
            );
            break;
          }

          // ==========================
          // 2. BPKB
          // ==========================
          case 'BPKB': {
            await this.collateralBPKBRepo.save(
              new CollateralByBPKB(
                { id: loanApp.id! },
                collateral_bpkb.atas_nama_bpkb,
                collateral_bpkb.no_stnk,
                collateral_bpkb.alamat_pemilik_bpkb,
                collateral_bpkb.type_kendaraan,
                collateral_bpkb.tahun_perakitan,
                collateral_bpkb.warna_kendaraan,
                collateral_bpkb.stransmisi,
                collateral_bpkb.no_rangka,
                parseFileUrl(
                  documents_files?.foto_no_rangka ??
                    collateral_bpkb.foto_no_rangka ??
                    null,
                ),
                collateral_bpkb.no_mesin,
                parseFileUrl(
                  documents_files?.foto_no_mesin ??
                    collateral_bpkb.foto_no_mesin ??
                    null,
                ),
                collateral_bpkb.no_bpkb,
                parseFileUrl(
                  documents_files?.dokumen_bpkb ??
                    collateral_bpkb.dokumen_bpkb ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_stnk_depan ??
                    collateral_bpkb.foto_stnk_depan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_stnk_belakang ??
                    collateral_bpkb.foto_stnk_belakang ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_depan ??
                    collateral_bpkb.foto_kendaraan_depan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_belakang ??
                    collateral_bpkb.foto_kendaraan_belakang ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_samping_kanan ??
                    collateral_bpkb.foto_kendaraan_samping_kanan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_samping_kiri ??
                    collateral_bpkb.foto_kendaraan_samping_kiri ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_sambara ??
                    collateral_bpkb.foto_sambara ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kwitansi_jual_beli ??
                    collateral_bpkb.foto_kwitansi_jual_beli ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_ktp_tangan_pertama ??
                    collateral_bpkb.foto_ktp_tangan_pertama ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_faktur_kendaraan ??
                    collateral_bpkb.foto_faktur_kendaraan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_snikb ??
                    collateral_bpkb.foto_snikb ??
                    null,
                ),
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              ),
            );
            break;
          }

          // ==========================
          // 3. Kedinasan MOU
          // ==========================
          case 'KEDINASAN_MOU': {
            await this.collateralKedinasanMOURepo.save(
              new CollateralByKedinasan_MOU(
                { id: loanApp.id! },
                collateral_kedinasan_mou.instansi,
                parseFileUrl(
                  documents_files?.surat_permohonan_kredit_mou ??
                    collateral_kedinasan_mou.surat_permohonan_kredit ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_pernyataan_penjamin_mou ??
                    collateral_kedinasan_mou.surat_pernyataan_penjamin ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_persetujuan_pimpinan_mou ??
                    collateral_kedinasan_mou.surat_persetujuan_pimpinan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_keterangan_gaji_mou ??
                    collateral_kedinasan_mou.surat_keterangan_gaji ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_form_pengajuan_mou ??
                    collateral_kedinasan_mou.foto_form_pengajuan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_kuasa_pemotongan_mou ??
                    collateral_kedinasan_mou.foto_surat_kuasa_pemotongan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_pernyataan_peminjam_mou ??
                    collateral_kedinasan_mou.foto_surat_pernyataan_peminjam ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_sk_golongan_terbaru_mou ??
                    collateral_kedinasan_mou.foto_sk_golongan_terbaru ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_keterangan_tpp_mou ??
                    collateral_kedinasan_mou.foto_keterangan_tpp ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_shm ??
                    collateral_kedinasan_mou.foto_biaya_operasional ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_kontrak_mou ??
                    collateral_kedinasan_mou.foto_surat_kontrak ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_rekomendasi_bendahara_mou ??
                    collateral_kedinasan_mou.foto_rekomendasi_bendahara ??
                    null,
                ),
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              ),
            );
            break;
          }

          // ==========================
          // 4. Kedinasan NON MOU
          // ==========================
          case 'KEDINASAN_NON_MOU': {
            await this.collateralKedinasanNonMOURepo.save(
              new CollateralByKedinasan_Non_MOU(
                { id: loanApp.id! },
                collateral_kedinasan_non_mou.instansi,
                parseFileUrl(
                  documents_files?.surat_permohonan_kredit_mou ??
                    collateral_kedinasan_non_mou.surat_permohonan_kredit ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_pernyataan_penjamin_mou ??
                    collateral_kedinasan_non_mou.surat_pernyataan_penjamin ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_persetujuan_pimpinan_mou ??
                    collateral_kedinasan_non_mou.surat_persetujuan_pimpinan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_keterangan_gaji_mou ??
                    collateral_kedinasan_non_mou.surat_keterangan_gaji ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_kontrak_mou ??
                    collateral_kedinasan_non_mou.foto_surat_kontrak ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_keterangan_tpp_mou ??
                    collateral_kedinasan_non_mou.foto_keterangan_tpp ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_biaya_operasional_mou ??
                    collateral_kedinasan_non_mou.foto_biaya_operasional ??
                    null,
                ),
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              ),
            );
            break;
          }
          // ==========================
          // 5. SHM
          // ==========================
          case 'SHM': {
            await this.collateralSHMRepo.save(
              new CollateralBySHM(
                { id: loanApp.id! },
                collateral_shm.atas_nama_shm,
                collateral_shm.hubungan_shm,
                collateral_shm.alamat_shm,
                collateral_shm.luas_shm,
                collateral_shm.njop_shm,
                parseFileUrl(
                  documents_files?.foto_shm ?? collateral_shm.foto_shm ?? null,
                ),
                parseFileUrl(
                  documents_files?.foto_kk_pemilik_shm ??
                    collateral_shm.foto_kk_pemilik_shm ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_pbb ?? collateral_shm.foto_pbb ?? null,
                ),
                parseFileUrl(
                  documents_files?.foto_objek_jaminan ??
                    collateral_shm.foto_objek_jaminan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_buku_nikah_suami ??
                    collateral_shm.foto_buku_nikah_suami ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_buku_nikah_istri ??
                    collateral_shm.foto_buku_nikah_istri ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_npwp ??
                    collateral_shm.foto_npwp ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_imb ?? collateral_shm.foto_imb ?? null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_ahli_waris ??
                    collateral_shm.foto_surat_ahli_waris ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_akte_kematian ??
                    collateral_shm.foto_surat_akte_kematian ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_pernyataan_kepemilikan_tanah ??
                    collateral_shm.foto_surat_pernyataan_kepemilikan_tanah ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_pernyataan_tidak_dalam_sengketa ??
                    collateral_shm.foto_surat_pernyataan_tidak_dalam_sengketa ??
                    null,
                ),
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              ),
            );
            break;
          }

          // ==========================
          // 6. UMKM
          // ==========================
          case 'UMKM': {
            await this.collateralUMKMRepo.save(
              new CollateralByUMKM(
                { id: loanApp.id! },
                parseFileUrl(
                  documents_files?.foto_sku ?? collateral_umkm.foto_sku ?? null,
                ),
                parseFileUrl(
                  normalizeFileInput(
                    documents_files?.foto_usaha ??
                      collateral_umkm.foto_usaha ??
                      null,
                  ),
                ),
                parseFileUrl(
                  documents_files?.foto_pembukuan ??
                    collateral_umkm.foto_pembukuan ??
                    null,
                ),
                undefined,
                nowWIB,
                nowWIB,
                undefined,
              ),
            );
            break;
          }

          // ==========================
          // Default
          // ==========================
          default:
            throw new BadRequestException(`Unknown collateral type: ${type}`);
        }

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
      console.error('Error in CreateLoanApplicationUseCase:', err);

      if (err instanceof HttpException) throw err;
      if (err.code === 'ECONNREFUSED' || err.name === 'MongoNetworkError') {
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
      throw new HttpException(
        {
          payload: {
            error: true,
            message: err?.message || 'Gagal membuat pengajuan',
            reference: 'LOAN_CREATE_ERROR',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

function normalizeFileInput(
  input:
    | string
    | string[]
    | Express.Multer.File
    | Express.Multer.File[]
    | null
    | undefined,
): string | Express.Multer.File | null {
  if (input == null) return null;

  if (Array.isArray(input)) {
    return input.length > 0 ? input[0] : null;
  }

  return input;
}

function parseFileUrl(
  input: string | Express.Multer.File | null | undefined,
): string | undefined {
  if (!input) return undefined;

  if (typeof input === 'string') {
    return input;
  }

  if ('path' in input) {
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
