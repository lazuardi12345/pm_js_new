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
import { AddressExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/address-external.entity';
import { JobExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/job-external.entity';
import { LoanApplicationExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/loanApp-external.entity';
import { OtherExistLoansExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/other-exist-loans-external.entity';
import { FinancialDependentsExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/financial-dependents-external.entity';
import { EmergencyContactExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/emergency-contact-external.entity';
import { LoanGuarantorExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/loan-guarantor-external.entity';
import { ClientExternalProfile } from 'src/Modules/LoanAppExternal/Domain/Entities/client-external-profile.entity';
import { CollateralByBPJS } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-bpjs-external.entity';
import { CollateralByBPKB } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-bpkb-external.entity';
import { CollateralByKedinasan_MOU } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-kedinasan-mou-external.entity';
import { CollateralByKedinasan_Non_MOU } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-kedinasan-non-mou-external.entity';
import { CollateralBySHM } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-shm-external.entity';
import { CollateralByUMKM } from 'src/Modules/LoanAppExternal/Domain/Entities/collateral-umkm.entity';
import { DetailInstallmentItemsExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/detail-installment-items-external.entity';
import { CicilanLainEnum } from 'src/Shared/Enums/External/Other-Exist-Loans.enum';

@Injectable()
export class MKT_CreateLoanApplicationUseCase {
  constructor(
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly clientRepo: IClientExternalRepository,
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

            customer = await this.uow.clientExternalRepo.save(client);
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
        await this.uow.addressExternalRepo.save(
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

        console.log('kuontol: >>>>', { id: customer.id! });

        await this.uow.jobExternalRepo.save(
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
            client_external.no_rek, //! kudu di cek lebih lanjut, gw cuma takut ini no rek PEKERJAAN bukan PRIBADI
            parseFileUrl(
              documents_files?.foto_id_card_peminjam ??
                job_external.foto_id_card_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_id_card_peminjam ??
                job_external.foto_id_card_peminjam ??
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

        const loanApp = await this.uow.loanAppExternalRepo.save(
          new LoanApplicationExternal(
            { id: customer.id! },
            loan_application_external.jenis_pembiayaan as JenisPembiayaanEnum,
            loan_application_external.nominal_pinjaman ?? 0,
            loan_application_external.tenor ?? 0,
            // parseFileUrl(
            //   documents_files?.berkas_jaminan ??
            //     loan_application_external.berkas_jaminan ??
            //     null,
            // ),
            null,
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

        await this.uow.clientProfileExternalRepo.save(
          new ClientExternalProfile(
            { id: customer.id! },
            { id: loanApp.id! },
            client_external.nama_lengkap,
            client_external.no_rek,
            client_external.jenis_kelamin as GENDER,
            client_external.no_hp,
            client_external.status_nikah,
            undefined,
            client_external.email,
            parseFileUrl(
              documents_files?.foto_rekening ??
                client_external.foto_rekening ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_ktp_peminjam ??
                client_external.foto_ktp_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_ktp_penjamin ??
                client_external.foto_ktp_penjamin ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_kk_peminjam ??
                client_external.foto_kk_peminjam ??
                null,
            ),
            parseFileUrl(
              documents_files?.foto_kk_penjamin ??
                client_external.foto_kk_penjamin ??
                null,
            ),
            parseFileUrl(
              documents_files?.dokumen_pendukung ??
                client_external.dokumen_pendukung ??
                null,
            ),
            client_external.validasi_nasabah,
            client_external.catatan,
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
              ? otherDto.cicilan_lain
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

          const savedParent =
            await this.uow.otherExistLoanExternalRepo.save(parent);

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

                return this.uow.detailInstallmentItemsExternalRepo.save(
                  detailInstallment,
                );
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

          await this.uow.otherExistLoanExternalRepo.save(parent);
        }

        await this.uow.financialDependentsExternalRepo.save(
          new FinancialDependentsExternal(
            { id: customer.id! },
            financial_dependents_external.kondisi_tanggungan,
            financial_dependents_external.validasi_tanggungan,
            undefined,
            nowWIB,
            nowWIB,
            undefined,
          ),
        );

        await this.uow.emergencyContactExternalRepo.save(
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

        await this.uow.loanGuarantorExternalRepo.save(
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

        switch (loan_external_type) {
          // ==========================
          // 1. BPJS
          // ==========================
          case 'BPJS': {
            await this.uow.collateralByBPJSRepo.save(
              new CollateralByBPJS(
                { id: loanApp.id! },
                collateral_bpjs_external.saldo_bpjs,
                collateral_bpjs_external.tanggal_bayar_terakhir,
                collateral_bpjs_external.username,
                collateral_bpjs_external.password,
                parseFileUrl(
                  documents_files?.foto_bpjs ??
                    collateral_bpjs_external.foto_bpjs ??
                    null,
                ),
                collateral_bpjs_external.jaminan_tambahan,
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
            await this.uow.collateralByBPKBRepo.save(
              new CollateralByBPKB(
                { id: loanApp.id! },
                collateral_bpkb_external.atas_nama_bpkb,
                collateral_bpkb_external.no_stnk,
                collateral_bpkb_external.alamat_pemilik_bpkb,
                collateral_bpkb_external.type_kendaraan,
                collateral_bpkb_external.tahun_perakitan,
                collateral_bpkb_external.warna_kendaraan,
                collateral_bpkb_external.stransmisi,
                collateral_bpkb_external.no_rangka,
                parseFileUrl(
                  documents_files?.foto_no_rangka ??
                    collateral_bpkb_external.foto_no_rangka ??
                    null,
                ),
                collateral_bpkb_external.no_mesin,
                parseFileUrl(
                  documents_files?.foto_no_mesin ??
                    collateral_bpkb_external.foto_no_mesin ??
                    null,
                ),
                collateral_bpkb_external.no_bpkb,
                parseFileUrl(
                  documents_files?.dokumen_bpkb ??
                    collateral_bpkb_external.dokumen_bpkb ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_stnk_depan ??
                    collateral_bpkb_external.foto_stnk_depan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_stnk_belakang ??
                    collateral_bpkb_external.foto_stnk_belakang ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_depan ??
                    collateral_bpkb_external.foto_kendaraan_depan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_belakang ??
                    collateral_bpkb_external.foto_kendaraan_belakang ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_samping_kanan ??
                    collateral_bpkb_external.foto_kendaraan_samping_kanan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kendaraan_samping_kiri ??
                    collateral_bpkb_external.foto_kendaraan_samping_kiri ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_sambara ??
                    collateral_bpkb_external.foto_sambara ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kwitansi_jual_beli ??
                    collateral_bpkb_external.foto_kwitansi_jual_beli ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_ktp_tangan_pertama ??
                    collateral_bpkb_external.foto_ktp_tangan_pertama ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_faktur_kendaraan ??
                    collateral_bpkb_external.foto_faktur_kendaraan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_snikb ??
                    collateral_bpkb_external.foto_snikb ??
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
            await this.uow.collateralByKedinasanMOURepo.save(
              new CollateralByKedinasan_MOU(
                { id: loanApp.id! },
                collateral_kedinasan_mou_external.instansi,
                parseFileUrl(
                  documents_files?.surat_permohonan_kredit_mou ??
                    collateral_kedinasan_mou_external.surat_permohonan_kredit ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_pernyataan_penjamin_mou ??
                    collateral_kedinasan_mou_external.surat_pernyataan_penjamin ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_persetujuan_pimpinan_mou ??
                    collateral_kedinasan_mou_external.surat_persetujuan_pimpinan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_keterangan_gaji_mou ??
                    collateral_kedinasan_mou_external.surat_keterangan_gaji ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_form_pengajuan_mou ??
                    collateral_kedinasan_mou_external.foto_form_pengajuan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_kuasa_pemotongan_mou ??
                    collateral_kedinasan_mou_external.foto_surat_kuasa_pemotongan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_pernyataan_peminjam_mou ??
                    collateral_kedinasan_mou_external.foto_surat_pernyataan_peminjam ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_sk_golongan_terbaru_mou ??
                    collateral_kedinasan_mou_external.foto_sk_golongan_terbaru ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_keterangan_tpp_mou ??
                    collateral_kedinasan_mou_external.foto_keterangan_tpp ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_shm ??
                    collateral_kedinasan_mou_external.foto_biaya_operasional ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_kontrak_mou ??
                    collateral_kedinasan_mou_external.foto_surat_kontrak ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_rekomendasi_bendahara_mou ??
                    collateral_kedinasan_mou_external.foto_rekomendasi_bendahara ??
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
            await this.uow.collateralByKedinasan_NON_MOURepo.save(
              new CollateralByKedinasan_Non_MOU(
                { id: loanApp.id! },
                collateral_kedinasan_non_mou_external.instansi,
                parseFileUrl(
                  documents_files?.surat_permohonan_kredit_mou ??
                    collateral_kedinasan_non_mou_external.surat_permohonan_kredit ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_pernyataan_penjamin_mou ??
                    collateral_kedinasan_non_mou_external.surat_pernyataan_penjamin ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_persetujuan_pimpinan_mou ??
                    collateral_kedinasan_non_mou_external.surat_persetujuan_pimpinan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.surat_keterangan_gaji_mou ??
                    collateral_kedinasan_non_mou_external.surat_keterangan_gaji ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_kontrak_mou ??
                    collateral_kedinasan_non_mou_external.foto_surat_kontrak ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_keterangan_tpp_mou ??
                    collateral_kedinasan_non_mou_external.foto_keterangan_tpp ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_biaya_operasional_mou ??
                    collateral_kedinasan_non_mou_external.foto_biaya_operasional ??
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
            await this.uow.collateralBySHMRepo.save(
              new CollateralBySHM(
                { id: loanApp.id! },
                collateral_shm_external.atas_nama_shm,
                collateral_shm_external.hubungan_shm,
                collateral_shm_external.alamat_shm,
                collateral_shm_external.luas_shm,
                collateral_shm_external.njop_shm,
                parseFileUrl(
                  documents_files?.foto_shm ??
                    collateral_shm_external.foto_shm ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_kk_pemilik_shm ??
                    collateral_shm_external.foto_kk_pemilik_shm ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_pbb ??
                    collateral_shm_external.foto_pbb ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_objek_jaminan ??
                    collateral_shm_external.foto_objek_jaminan ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_buku_nikah_suami ??
                    collateral_shm_external.foto_buku_nikah_suami ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_buku_nikah_istri ??
                    collateral_shm_external.foto_buku_nikah_istri ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_npwp ??
                    collateral_shm_external.foto_npwp ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_imb ??
                    collateral_shm_external.foto_imb ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_ahli_waris ??
                    collateral_shm_external.foto_surat_ahli_waris ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_akte_kematian ??
                    collateral_shm_external.foto_surat_akte_kematian ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_pernyataan_kepemilikan_tanah ??
                    collateral_shm_external.foto_surat_pernyataan_kepemilikan_tanah ??
                    null,
                ),
                parseFileUrl(
                  documents_files?.foto_surat_pernyataan_tidak_dalam_sengketa ??
                    collateral_shm_external.foto_surat_pernyataan_tidak_dalam_sengketa ??
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
            await this.uow.collateralByUMKMRepo.save(
              new CollateralByUMKM(
                { id: loanApp.id! },
                parseFileUrl(
                  documents_files?.foto_sku ??
                    collateral_umkm_external.foto_sku ??
                    null,
                ),
                parseFileUrl(
                  normalizeFileInput(
                    documents_files?.foto_usaha ??
                      collateral_umkm_external.foto_usaha ??
                      null,
                  ),
                ),
                parseFileUrl(
                  documents_files?.foto_pembukuan ??
                    collateral_umkm_external.foto_pembukuan ??
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
          default:
            throw new BadRequestException(
              `Unknown collateral type: ${loan_external_type}`,
            );
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
