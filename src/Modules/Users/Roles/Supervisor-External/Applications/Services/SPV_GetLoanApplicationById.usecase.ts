// Applications/UseCases/MKT_GetLoanApplicationById.usecase.ts
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

import {
  TypeLoanApplicationDetail,
  TypeApprovalDetail,
  TypeStatusApproval,
} from '../../../Marketing-External/Applications/DTOS/MKT_CreateLoanApplicationExternal.dto';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';
import { LoanType } from 'src/Shared/Enums/External/Loan-Application.enum';

@Injectable()
export class SPV_GetLoanApplicationByIdUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftExternalRepository,
  ) {}

  async execute(id: number, type: LoanType) {
    // pastikan repository return shape: [TypeLoanApplicationDetail[], TypeApprovalDetail[]]
    const result =
      await this.loanAppRepo.callSP_SPV_GetDetail_LoanApplicationsExternal_ById(
        id,
      );

    // tulis explicit typing supaya TS gak bingung
    const [loanDataRows, approvals]: [
      TypeLoanApplicationDetail[] | undefined,
      TypeApprovalDetail[] | undefined,
    ] = result as any;

    const loanData = loanDataRows?.[0];
    if (!loanData) {
      throw new NotFoundException(`Loan Application with id ${id} not found`);
    }

    let approval_recommendation: any = null;
    const noKtp = loanData.no_ktp ?? null;
    const nominalPinjaman = Number(loanData.nominal_pinjaman ?? 0);

    try {
      let draftData: any = null;
      if (noKtp !== null) {
        draftData = await this.loanAppDraftRepo.findStatus(noKtp);
        console.log(draftData);
      }

      console.log(
        'back to be friends',
        await this.loanAppDraftRepo.findStatus(noKtp),
      );

      if (draftData) {
        try {
          const approvalData = await this.approvalRecomRepo.findByDraftId(
            draftData.draft_id,
          );

          console.log('ANJAY', approvalData);

          if (approvalData) {
            approval_recommendation = {
              draft_id: approvalData.draft_id ?? draftData.draft_id,
              nama_nasabah:
                approvalData.nama_nasabah ?? loanData.nama_lengkap ?? '-',
              recommendation: approvalData.recommendation ?? null,
              filePath: approvalData.filePath ?? null,
              catatan: approvalData.catatan ?? null,
              last_updated: approvalData.updated_at ?? null,
              isNeedCheck: !!draftData.isNeedCheck,
            };

            const approvalNominal = Number(approvalData.nominal_pinjaman ?? 0);
            if (!Number.isNaN(approvalNominal) && approvalNominal < 7000000) {
              approval_recommendation.dont_have_check = true;
            }
          } else {
            if (!Number.isNaN(nominalPinjaman) && nominalPinjaman < 7000000) {
              approval_recommendation = {
                draft_id: draftData.draft_id,
                isNeedCheck: !!draftData.isNeedCheck,
                dont_have_check: true,
              };
            } else {
              approval_recommendation = null;
            }
          }
        } catch (approvalErr) {
          console.error(
            `Warning: failed to fetch approval recommendation for draft_id=${draftData.draft_id}`,
            approvalErr,
          );
          approval_recommendation = {
            error: true,
            message: 'Failed to fetch approval recommendation',
            reference: 'RECOMMENDATION_FETCH_FAILED',
          };
        }
      } else {
        // Fallback: jika tidak ada draftData tapi nominal <7jt -> mark dont_have_check
        if (!Number.isNaN(nominalPinjaman) && nominalPinjaman < 7000000) {
          approval_recommendation = {
            dont_have_check: true,
          };
        } else {
          approval_recommendation = null;
        }
      }
    } catch (draftErr) {
      console.error(
        `Warning: failed to fetch draft status for no_ktp=${noKtp}`,
        draftErr,
      );
    }

    const loanAppStatus: Record<string, TypeStatusApproval | null> = {};
    const appealStatus: Record<string, TypeStatusApproval | null> = {};

    // mapping role ke key yang konsisten
    const roleMap: Record<string | number, string> = {
      SPV: 'spv',
      HM: 'hm',
      Supervisor: 'spv',
      'Head Marketing': 'hm',
      1: 'spv',
      2: 'hm',
    };

    // === IMPORTANT: approvals is TypeApprovalDetail[] ===
    (approvals ?? []).forEach((approval: TypeApprovalDetail) => {
      const roleKey = roleMap[approval.role] ?? approval.role;

      const data: TypeStatusApproval = {
        id_user: approval.user_id,
        name: approval.user_nama,
        data: {
          id_approval: approval.approval_id,
          status: approval.status,
          keterangan: approval.keterangan,
          kesimpulan: approval.kesimpulan,
          approved_tenor: approval.tenor_persetujuan,
          approved_amount: approval.nominal_persetujuan,
          created_at: approval.created_at,
          updated_at: approval.updated_at,
        },
      };

      const isBanding = approval.is_banding === 1;

      if (isBanding) {
        appealStatus[roleKey] = data;
      } else {
        loanAppStatus[roleKey] = data;
      }
    });

    let collateralData = {};

    switch (type) {
      case 'BPJS':
        collateralData = {
          collateral_bpjs: {
            pengajuan_id: loanData.pengajuan_bpjs?.pengajuan_id,

            saldo_bpjs: loanData.pengajuan_bpjs?.saldo_bpjs,
            tanggal_bayar_terakhir:
              loanData.pengajuan_bpjs?.tanggal_bayar_terakhir,
            username: loanData.pengajuan_bpjs?.username,
            password: loanData.pengajuan_bpjs?.password,

            foto_bpjs: loanData.pengajuan_bpjs?.foto_bpjs,
            jaminan_tambahan: loanData.pengajuan_bpjs?.jaminan_tambahan,
          },
        };
        break;

      case 'BPKB':
        collateralData = {
          collateral_bpkb: {
            atas_nama_bpkb: loanData.pengajuan_bpkb?.atas_nama_bpkb,
            no_stnk: loanData.pengajuan_bpkb?.no_stnk,
            alamat_pemilik_bpkb: loanData.pengajuan_bpkb?.alamat_pemilik_bpkb,
            type_kendaraan: loanData.pengajuan_bpkb?.type_kendaraan,
            tahun_perakitan: loanData.pengajuan_bpkb?.tahun_perakitan,
            warna_kendaraan: loanData.pengajuan_bpkb?.warna_kendaraan,
            stransmisi: loanData.pengajuan_bpkb?.stransmisi,

            no_rangka: loanData.pengajuan_bpkb?.no_rangka,
            foto_no_rangka: loanData.pengajuan_bpkb?.foto_no_rangka,
            no_mesin: loanData.pengajuan_bpkb?.no_mesin,
            foto_no_mesin: loanData.pengajuan_bpkb?.foto_no_mesin,
            foto_faktur_kendaraan:
              loanData.pengajuan_bpkb?.foto_faktur_kendaraan,
            foto_snikb: loanData.pengajuan_bpkb?.foto_snikb,

            no_bpkb: loanData.pengajuan_bpkb?.no_bpkb,
            dokumen_bpkb: loanData.pengajuan_bpkb?.dokumen_bpkb,

            foto_stnk_depan: loanData.pengajuan_bpkb?.foto_stnk_depan,
            foto_stnk_belakang: loanData.pengajuan_bpkb?.foto_stnk_belakang,

            foto_kendaraan_depan: loanData.pengajuan_bpkb?.foto_kendaraan_depan,
            foto_kendaraan_belakang:
              loanData.pengajuan_bpkb?.foto_kendaraan_belakang,
            foto_kendaraan_samping_kanan:
              loanData.pengajuan_bpkb?.foto_kendaraan_samping_kanan,
            foto_kendaraan_samping_kiri:
              loanData.pengajuan_bpkb?.foto_kendaraan_samping_kiri,

            foto_sambara: loanData.pengajuan_bpkb?.foto_sambara,
            foto_kwitansi_jual_beli:
              loanData.pengajuan_bpkb?.foto_kwitansi_jual_beli,
            foto_ktp_tangan_pertama:
              loanData.pengajuan_bpkb?.foto_ktp_tangan_pertama,
          },
        };
        break;

      case 'KEDINASAN_MOU':
        collateralData = {
          collateral_kedinasan_mou: {
            instansi: loanData.pengajuan_kedinasan_mou?.instansi,

            surat_permohonan_kredit:
              loanData.pengajuan_kedinasan_mou?.surat_permohonan_kredit,
            surat_pernyataan_penjamin:
              loanData.pengajuan_kedinasan_mou?.surat_pernyataan_penjamin,
            surat_persetujuan_pimpinan:
              loanData.pengajuan_kedinasan_mou?.surat_persetujuan_pimpinan,
            surat_keterangan_gaji:
              loanData.pengajuan_kedinasan_mou?.surat_keterangan_gaji,

            foto_form_pengajuan:
              loanData.pengajuan_kedinasan_mou?.foto_form_pengajuan,
            foto_surat_kuasa_pemotongan:
              loanData.pengajuan_kedinasan_mou?.foto_surat_kuasa_pemotongan,
            foto_surat_pernyataan_peminjam:
              loanData.pengajuan_kedinasan_mou?.foto_surat_pernyataan_peminjam,

            foto_sk_golongan_terbaru:
              loanData.pengajuan_kedinasan_mou?.foto_sk_golongan_terbaru,
            foto_keterangan_tpp:
              loanData.pengajuan_kedinasan_mou?.foto_keterangan_tpp,
            foto_biaya_operasional:
              loanData.pengajuan_kedinasan_mou?.foto_biaya_operasional,

            foto_surat_kontrak:
              loanData.pengajuan_kedinasan_mou?.foto_surat_kontrak, // sesuai DTO lo

            foto_rekomendasi_bendahara:
              loanData.pengajuan_kedinasan_mou?.foto_rekomendasi_bendahara,
          },
        };
        break;

      case 'KEDINASAN_NON_MOU':
        collateralData = {
          collateral_kedinasan_non_mou: {
            instansi: loanData.pengajuan_kedinasan_non_mou?.instansi,
            surat_permohonan_kredit:
              loanData.pengajuan_kedinasan_non_mou?.surat_permohonan_kredit,
            surat_pernyataan_penjamin:
              loanData.pengajuan_kedinasan_non_mou?.surat_pernyataan_penjamin,
            surat_persetujuan_pimpinan:
              loanData.pengajuan_kedinasan_non_mou?.surat_persetujuan_pimpinan,
            surat_keterangan_gaji:
              loanData.pengajuan_kedinasan_non_mou?.surat_keterangan_gaji,

            foto_surat_kontrak:
              loanData.pengajuan_kedinasan_non_mou?.foto_surat_kontrak,
            foto_keterangan_tpp:
              loanData.pengajuan_kedinasan_non_mou?.foto_keterangan_tpp,
            foto_biaya_operasional:
              loanData.pengajuan_kedinasan_non_mou?.foto_biaya_operasional,
          },
        };
        break;

      case 'SHM':
        collateralData = {
          collateral_shm: {
            atas_nama_shm: loanData.pengajuan_shm?.atas_nama_shm,
            hubungan_shm: loanData.pengajuan_shm?.hubungan_shm,
            alamat_shm: loanData.pengajuan_shm?.alamat_shm,
            luas_shm: loanData.pengajuan_shm?.luas_shm,
            njop_shm: loanData.pengajuan_shm?.njop_shm,

            foto_shm: loanData.pengajuan_shm?.foto_shm,
            foto_kk_pemilik_shm: loanData.pengajuan_shm?.foto_kk_pemilik_shm,
            foto_pbb: loanData.pengajuan_shm?.foto_pbb,

            foto_objek_jaminan: loanData.pengajuan_shm?.foto_objek_jaminan, // kalau array → confirm, gue sesuaikan

            foto_buku_nikah_suami:
              loanData.pengajuan_shm?.foto_buku_nikah_suami,
            foto_buku_nikah_istri:
              loanData.pengajuan_shm?.foto_buku_nikah_istri,

            foto_npwp: loanData.pengajuan_shm?.foto_npwp,
            foto_imb: loanData.pengajuan_shm?.foto_imb,

            foto_surat_ahli_waris:
              loanData.pengajuan_shm?.foto_surat_ahli_waris,
            foto_surat_akte_kematian:
              loanData.pengajuan_shm?.foto_surat_akte_kematian,

            foto_surat_pernyataan_kepemilikan_tanah:
              loanData.pengajuan_shm?.foto_surat_pernyataan_kepemilikan_tanah,
            foto_surat_pernyataan_tidak_dalam_sengketa:
              loanData.pengajuan_shm
                ?.foto_surat_pernyataan_tidak_dalam_sengketa,
          },
        };
        break;

      case 'UMKM':
        collateralData = {
          collateral_umkm: {
            foto_sku: loanData.pengajuan_umkm?.foto_sku,

            foto_usaha: loanData.pengajuan_umkm?.foto_usaha, // kalau array → confirm, gue ubah ke string[]
            foto_pembukuan: loanData.pengajuan_umkm?.foto_pembukuan,
          },
        };
        break;

      default:
        throw new BadRequestException('Invalid collateral type');
    }

    return {
      error: false,
      message: 'Loan Application Detail by ID retrieved successfully',
      reference: 'SPV_LOAN_RETRIEVE_OK',
      data: {
        client_and_loan_detail: {
          clients_external: {
            client_id: loanData.client_id,
            nama_lengkap: loanData.nama_lengkap,
            nik: loanData.no_ktp,
            no_kk: loanData.no_kk,
            no_rek: loanData.no_rekening,
            foto_rekening: loanData.foto_rekening,
            jenis_kelamin: loanData.jenis_kelamin,
            tempat_lahir: loanData.tempat_lahir,
            tanggal_lahir: new Date(loanData.tanggal_lahir)
              .toISOString()
              .split('T')[0],
            no_hp: loanData.no_hp,
            email: loanData.email,
            status_nikah: loanData.status_nikah,
            foto_ktp_peminjam: loanData.foto_ktp_peminjam,
            foto_ktp_penjamin: loanData.foto_ktp_penjamin,
            foto_kk_peminjam: loanData.foto_kk_peminjam,
            foto_kk_penjamin: loanData.foto_kk_penjamin,
            dokumen_pendukung: loanData.dokumen_pendukung,
            validasi_nasabah: loanData.validasi_nasabah,
            catatan: loanData.catatan,
          },
          address_external: {
            alamat_ktp: loanData.alamat_ktp,
            rt_rw: loanData.rt_rw,
            kelurahan: loanData.kelurahan,
            kecamatan: loanData.kecamatan,
            kota: loanData.kota,
            provinsi: loanData.provinsi,
            status_rumah: loanData.status_rumah, // enum
            biaya_perbulan: loanData.biaya_perbulan, // optional
            biaya_pertahun: loanData.biaya_pertahun, // optional
            domisili: loanData.domisili, // enum
            alamat_domisili: loanData.alamat_domisili, // optional
            rumah_domisili: loanData.rumah_domisili, // enum
            biaya_perbulan_domisili: loanData.biaya_perbulan_domisili, // optional
            biaya_pertahun_domisili: loanData.biaya_pertahun_domisili, // optional
            lama_tinggal: loanData.lama_tinggal, // optional
            atas_nama_listrik: loanData.atas_nama_listrik,
            hubungan: loanData.hubungan,
            foto_meteran_listrik: loanData.foto_meteran_listrik, // optional
            share_loc_domisili: loanData.share_loc_domisili, // @IsNotEmpty but optional type
            share_loc_usaha: loanData.share_loc_usaha, // optional
            share_loc_tempat_kerja: loanData.share_loc_tempat_kerja, // optional
            validasi_alamat: loanData.validasi_alamat, // optional boolean
            catatan: loanData.catatan, // optional
          },

          job_external: {
            perusahaan: loanData.perusahaan,
            alamat_perusahaan: loanData.alamat_perusahaan,
            kontak_perusahaan: loanData.kontak_perusahaan,
            jabatan: loanData.jabatan,
            lama_kerja: loanData.lama_kerja,
            status_karyawan: loanData.status_karyawan, // enum
            lama_kontrak: loanData.lama_kontrak, // optional
            pendapatan_perbulan: loanData.pendapatan_perbulan, // optional number
            slip_gaji_peminjam: loanData.slip_gaji_peminjam, // optional
            slip_gaji_penjamin: loanData.slip_gaji_penjamin, // optional
            id_card_peminjam: loanData.id_card_peminjam, // optional
            id_card_penjamin: loanData.id_card_penjamin, // optional
            rekening_koran: loanData.rekening_koran, // optional
            validasi_pekerjaan: loanData.validasi_pekerjaan, // optional boolean
            catatan: loanData.catatan, // optional
          },
          emergency_contact: {
            nama_kontak_darurat:
              loanData.emergency_contacts.nama_kontak_darurat,
            hubungan_kontak_darurat:
              loanData.emergency_contacts.hubungan_kontak_darurat,
            no_hp_kontak_darurat:
              loanData.emergency_contacts.no_hp_kontak_darurat,

            validasi_kontak_darurat:
              loanData.emergency_contacts.validasi_kontak_darurat, // optional boolean
            catatan: loanData.emergency_contacts.catatan, // optional string
          },
          financial_dependents: {
            kondisi_tanggungan:
              loanData.financial_dependents.kondisi_tanggungan, // optional string
            validasi_tanggungan:
              loanData.financial_dependents.validasi_tanggungan, // optional boolean
            catatan: loanData.financial_dependents.catatan_tanggungan, // optional string
          },
          loan_guarantor: {
            hubungan_penjamin: loanData.loan_guarantors.hubungan_penjamin, // enum

            nama_penjamin: loanData.loan_guarantors.nama_penjamin,
            pekerjaan_penjamin: loanData.loan_guarantors.pekerjaan_penjamin,

            penghasilan_penjamin: loanData.loan_guarantors.penghasilan_penjamin,
            no_hp_penjamin: loanData.loan_guarantors.no_hp_penjamin,

            persetujuan_penjamin: loanData.loan_guarantors.persetujuan_penjamin, // enum
            foto_ktp_penjamin: loanData.loan_guarantors.foto_ktp_penjamin,

            validasi_penjamin: loanData.loan_guarantors.validasi_penjamin, // optional boolean
            catatan: loanData.loan_guarantors.catatan_penjamin, // optional string
          },
          other_exist_loan: {
            cicilan_lain: loanData.other_loans.cicilan_lain, // enum

            nama_pembiayaan: loanData.other_loans.nama_pembiayaan,
            total_pinjaman: loanData.other_loans.total_pinjaman, // optional string

            cicilan_perbulan: loanData.other_loans.cicilan_perbulan,
            sisa_tenor: loanData.other_loans.sisa_tenor,

            validasi_pinjaman_lain: loanData.other_loans.validasi_pinjaman_lain, // optional boolean
            catatan: loanData.other_loans.catatan_pinjaman_lain, // optional string
          },
          collateral: collateralData,
          // documents_files: {
          //   foto_ktp: loanData.foto_ktp,
          //   foto_kk: loanData.foto_kk,
          //   foto_id_card: loanData.foto_id_card,
          //   foto_rekening: loanData.foto_rekening,
          //   bukti_absensi_file: loanData.bukti_absensi_file,
          //   foto_ktp_penjamin: loanData.foto_ktp_penjamin,
          //   foto_id_card_penjamin: loanData.foto_id_card_penjamin,
          // },
          approval_recommendation,
        },
        loan_app_status: loanAppStatus,
        appeal_status: appealStatus,
      },
    };
  }
  catch(err) {
    // --- ERROR DARI NEST / HTTP ---
    if (err instanceof HttpException) throw err;

    // --- UNEXPECTED ERROR ---
    console.error('Unexpected error:', err);

    throw new InternalServerErrorException(
      'Unexpected error while retrieving loan application detail',
    );
  }
}
