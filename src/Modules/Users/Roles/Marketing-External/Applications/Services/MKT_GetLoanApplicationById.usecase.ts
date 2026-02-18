// Applications/UseCases/MKT_GetLoanApplicationById.usecase.ts
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

// import {
//   TypeLoanApplicationDetail,
//   TypeApprovalDetail,
//   TypeStatusApproval,
// } from '../DTOS/MKT_CreateLoanApplicationExternal.dto';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import { LoanType } from 'src/Shared/Enums/External/Loan-Application.enum';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';

@Injectable()
export class MKT_GetLoanApplicationByIdUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftExternalRepository,
  ) {}

  async execute(id: number) {
    try {
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('Invalid loan application ID');
      }
      const result =
        await this.loanAppRepo.callSP_MKT_GetDetail_LoanApplicationsExternal_ById(
          id,
        );

      if (!result || !Array.isArray(result)) {
        throw new InternalServerErrorException(
          'Stored Procedure returned invalid result format',
        );
      }
      const [
        coreDataRows, // Result Set 1: Core Data
        attachmentRows, // Result Set 2: Attachment (conditional)
        otherLoansRows, // Result Set 3: Other Loans (parent)
        installmentDetailsRows, // Result Set 4: Installment Details (child)
        surveyReportRows, // Result Set 5: Survey Report
        surveyPhotosRows, // Result Set 6: Survey Photos
        approvalsRows, // Result Set 7: Approvals
      ] = result as any[];

      const loanData = coreDataRows?.[0];

      if (!loanData) {
        throw new NotFoundException(`Loan Application with id ${id} not found`);
      }

      console.log('MKT - LOAN DATA GET BY ID: ', loanData);

      // ============================================================
      // 4. APPROVAL RECOMMENDATION LOGIC (EXISTING)
      // ============================================================
      let approval_recommendation: any = null;
      const noKtp = loanData.no_ktp ?? null;
      // const nominalPinjaman = Number(loanData.nominal_pinjaman ?? 0);

      try {
        let draftData: any = null;
        if (noKtp !== null) {
          draftData = await this.loanAppDraftRepo.findStatus(noKtp);
          console.log('MKT - DRAFT DATA GET BY ID: ', draftData);
        }

        if (draftData) {
          try {
            const approvalData = await this.approvalRecomRepo.findByDraftId(
              draftData.draft_id,
            );

            console.log(approvalData);

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
        }
      } catch (draftErr) {
        console.error(
          `Warning: failed to fetch draft status for no_ktp=${noKtp}`,
          draftErr,
        );
      }

      // ============================================================
      // 5. PROCESS APPROVALS (EXISTING LOGIC)
      // ============================================================
      const loanAppStatus: Record<string, any> = {};
      const appealStatus: Record<string, any> = {};

      const roleMap: Record<string | number, string> = {
        // SPV: 'spv',
        // Supervisor: 'spv',
        // 1: 'spv',
        HM: 'hm',
        'Head Marketing': 'hm',
        3: 'hm',
      };

      (approvalsRows ?? []).forEach((approval: any) => {
        if (!approval) return;

        const roleKey = roleMap[approval.role] ?? approval.role;

        const data = {
          id_user: approval.user_id,
          name: approval.user_nama,
          data: {
            id_approval: approval.approval_id,
            status: approval.status,
            keterangan: approval.keterangan,
            kesimpulan: approval.kesimpulan,
            approved_tenor: approval.approved_tenor,
            approved_amount: approval.approved_amount,
            additional_files: approval?.additional_files ?? '-',
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

      // ============================================================
      // 6. MAP COLLATERAL DATA
      // ============================================================
      const collateralData = this.mapCollateralData(
        loanData.jenis_pembiayaan,
        attachmentRows?.[0],
      );

      // ============================================================
      // 7. MAP OTHER LOANS WITH DETAILS
      // ============================================================
      const otherLoans = this.mapOtherLoans(
        otherLoansRows || [],
        installmentDetailsRows || [],
      );

      // ============================================================
      // 8. BUILD FINAL RESPONSE
      // ============================================================
      return {
        error: false,
        message: 'Loan Application Detail by ID retrieved successfully',
        reference: 'LOAN_RETRIEVE_OK',
        data: {
          client_and_loan_detail: {
            client_external: {
              client_id: loanData.client_id,
              nama_lengkap: loanData.nama_lengkap,
              nik: loanData.no_ktp,
              no_kk: loanData.no_kk,
              no_rek: loanData.no_rekening,
              foto_rekening: loanData.foto_rekening,
              jenis_kelamin: loanData.jenis_kelamin,
              tempat_lahir: loanData.tempat_lahir,
              tanggal_lahir: loanData.tanggal_lahir
                ? new Date(loanData.tanggal_lahir).toISOString().split('T')[0]
                : null,
              no_hp: loanData.no_hp,
              email: loanData.email,
              status_nikah: loanData.status_nikah,
              foto_ktp_peminjam: loanData.foto_ktp_peminjam,
              foto_ktp_penjamin: loanData.foto_ktp_penjamin,
              foto_kk_peminjam: loanData.foto_kk_peminjam,
              foto_kk_penjamin: loanData.foto_kk_penjamin,
              dokumen_pendukung: loanData.dokumen_pendukung,
              tipe_nasabah: 'reguler',
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
              status_rumah: loanData.status_rumah,
              biaya_perbulan: loanData.biaya_perbulan,
              biaya_pertahun: loanData.biaya_pertahun,
              domisili: loanData.domisili,
              alamat_domisili: loanData.alamat_domisili,
              rumah_domisili: loanData.rumah_domisili,
              biaya_perbulan_domisili: loanData.biaya_perbulan_domisili,
              biaya_pertahun_domisili: loanData.biaya_pertahun_domisili,
              lama_tinggal: loanData.lama_tinggal,
              atas_nama_listrik: loanData.atas_nama_listrik,
              hubungan: loanData.hubungan,
              foto_meteran_listrik: loanData.foto_meteran_listrik,
              share_loc_domisili: loanData.share_loc_domisili,
              share_loc_usaha: loanData.share_loc_usaha,
              share_loc_tempat_kerja: loanData.share_loc_tempat_kerja,
              validasi_alamat: loanData.validasi_alamat,
              catatan: loanData.catatan_alamat,
            },

            job_external: {
              perusahaan: loanData.perusahaan,
              alamat_perusahaan: loanData.alamat_perusahaan,
              kontak_perusahaan: loanData.kontak_perusahaan,
              jabatan: loanData.jabatan,
              lama_kerja: loanData.lama_kerja,
              status_karyawan: loanData.status_karyawan,
              lama_kontrak: loanData.lama_kontrak,
              pendapatan_perbulan: loanData.pendapatan_perbulan,
              slip_gaji_peminjam: loanData.slip_gaji_peminjam,
              slip_gaji_penjamin: loanData.slip_gaji_penjamin,
              id_card_peminjam: loanData.id_card_peminjam,
              id_card_penjamin: loanData.id_card_penjamin,
              rekening_koran: loanData.rekening_koran,
              validasi_pekerjaan: loanData.validasi_pekerjaan,
              catatan: loanData.catatan_pekerjaan,
            },

            loan_application_external: {
              jenis_pembiayaan: loanData.jenis_pembiayaan,
              nominal_pinjaman: loanData.nominal_pinjaman,
              tenor: loanData.tenor,
              berkas_jaminan: loanData.berkas_jaminan,
              status_pinjaman: loanData.status_pinjaman,
              pinjaman_ke: loanData.pinjaman_ke,
              pinjaman_terakhir: loanData.pinjaman_terakhir,
              sisa_pinjaman: loanData.sisa_pinjaman,
              realisasi_pinjaman: loanData.realisasi_pinjaman,
              cicilan_perbulan: loanData.cicilan_perbulan,
              status_pengajuan: loanData.status_pengajuan,
              validasi_pengajuan: loanData.validasi_pengajuan,
              catatan: loanData.catatan_pengajuan,
              catatan_spv: loanData.catatan_spv,
              catatan_marketing: loanData.catatan_marketing,
              is_banding: loanData.is_banding,
              alasan_banding: loanData.alasan_banding,
            },

            emergency_contact_external: {
              nama_kontak_darurat: loanData.nama_kontak_darurat || null,
              hubungan_kontak_darurat: loanData.hubungan_kontak_darurat || null,
              no_hp_kontak_darurat: loanData.no_hp_kontak_darurat || null,
              validasi_kontak_darurat: loanData.validasi_kontak_darurat || null,
              catatan: loanData.catatan_kontak_darurat || null,
            },

            financial_dependents_external: {
              kondisi_tanggungan: loanData.kondisi_tanggungan || null,
              validasi_tanggungan: loanData.validasi_tanggungan || null,
              catatan: loanData.catatan_tanggungan || null,
            },

            loan_guarantor_external: {
              hubungan_penjamin: loanData.hubungan_penjamin || null,
              nama_penjamin: loanData.nama_penjamin || null,
              pekerjaan_penjamin: loanData.pekerjaan_penjamin || null,
              penghasilan_penjamin: loanData.penghasilan_penjamin || null,
              no_hp_penjamin: loanData.no_hp_penjamin || null,
              persetujuan_penjamin: loanData.persetujuan_penjamin || null,
              foto_ktp_penjamin: loanData.foto_ktp_penjamin_guarantor || null,
              validasi_penjamin: loanData.validasi_penjamin || null,
              catatan: loanData.catatan_penjamin || null,
            },
            other_exist_loan_external:
              otherLoans.length > 0
                ? otherLoans[0]
                : {
                    cicilan_lain: null,
                    cicilan: [],
                  },
            collateral: collateralData,
            documents_files: {
              foto_rekening: loanData.foto_rekening,
              foto_ktp_peminjam: loanData.foto_ktp_peminjam,
              foto_ktp_penjamin: loanData.foto_ktp_penjamin,
              foto_kk_peminjam: loanData.foto_kk_peminjam,
              foto_kk_penjamin: loanData.foto_kk_penjamin,
              dokumen_pendukung: loanData.dokumen_pendukung,
              foto_meteran_listrik: loanData.foto_meteran_listrik,
              slip_gaji_peminjam: loanData.slip_gaji_peminjam,
              slip_gaji_penjamin: loanData.slip_gaji_penjamin,
              foto_id_card_peminjam: loanData.id_card_peminjam,
              foto_id_card_penjamin: loanData.id_card_penjamin,
              rekening_koran: loanData.rekening_koran,
              berkas_jaminan: loanData.berkas_jaminan,
            },
            survey_report: surveyReportRows?.[0] || null,
            survey_photos: surveyPhotosRows || [],
            approval_recommendation,
          },
          appeal_notes: loanData.loan_alasan_banding,
          loan_app_status: loanAppStatus,
          appeal_status: appealStatus,
        },
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  // ============================================================
  // HELPER: Map Collateral Data
  // ============================================================
  private mapCollateralData(jenis_pembiayaan: string, attachmentData: any) {
    if (!attachmentData || !attachmentData.attachment_type) {
      return {};
    }

    switch (jenis_pembiayaan) {
      case 'BPJS':
        return {
          bpjs: {
            pengajuan_id: attachmentData.pengajuan_id,
            saldo_bpjs: attachmentData.saldo_bpjs,
            tanggal_bayar_terakhir: attachmentData.tanggal_bayar_terakhir,
            username: attachmentData.username,
            password: attachmentData.password,
            foto_bpjs: attachmentData.foto_bpjs,
            dokumen_pendukung_bpjs: attachmentData.jaminan_tambahan,
          },
        };

      case 'BPKB':
        return {
          bpkb: {
            pengajuan_id: attachmentData.pengajuan_id,
            atas_nama_bpkb: attachmentData.atas_nama_bpkb,
            no_stnk: attachmentData.no_stnk,
            alamat_pemilik_bpkb: attachmentData.alamat_pemilik_bpkb,
            type_kendaraan: attachmentData.type_kendaraan,
            tahun_perakitan: attachmentData.tahun_perakitan,
            warna_kendaraan: attachmentData.warna_kendaraan,
            stransmisi: attachmentData.stransmisi,
            no_rangka: attachmentData.no_rangka,
            foto_no_rangka: attachmentData.foto_no_rangka,
            no_mesin: attachmentData.no_mesin,
            foto_no_mesin: attachmentData.foto_no_mesin,
            foto_faktur_kendaraan: attachmentData.foto_faktur_kendaraan,
            foto_snikb: attachmentData.foto_snikb,
            no_bpkb: attachmentData.no_bpkb,
            dokumen_bpkb: attachmentData.dokumen_bpkb,
            foto_stnk_depan: attachmentData.foto_stnk_depan,
            foto_stnk_belakang: attachmentData.foto_stnk_belakang,
            foto_kendaraan_depan: attachmentData.foto_kendaraan_depan,
            foto_kendaraan_belakang: attachmentData.foto_kendaraan_belakang,
            foto_kendaraan_samping_kanan:
              attachmentData.foto_kendaraan_samping_kanan,
            foto_kendaraan_samping_kiri:
              attachmentData.foto_kendaraan_samping_kiri,
            foto_sambara: attachmentData.foto_sambara,
            foto_kwitansi_jual_beli: attachmentData.foto_kwitansi_jual_beli,
            foto_ktp_tangan_pertama: attachmentData.foto_ktp_tangan_pertama,
          },
        };

      case 'KEDINASAN_MOU':
        return {
          kedinasan_mou: {
            pengajuan_id: attachmentData.pengajuan_id,
            instansi: attachmentData.instansi,
            surat_permohonan_kredit: attachmentData.surat_permohonan_kredit,
            surat_pernyataan_penjamin: attachmentData.surat_pernyataan_penjamin,
            surat_persetujuan_pimpinan:
              attachmentData.surat_persetujuan_pimpinan,
            surat_keterangan_gaji: attachmentData.surat_keterangan_gaji,
            foto_form_pengajuan: attachmentData.foto_form_pengajuan,
            foto_surat_kuasa_pemotongan:
              attachmentData.foto_surat_kuasa_pemotongan,
            foto_surat_pernyataan_peminjam:
              attachmentData.foto_surat_pernyataan_peminjam,
            foto_sk_golongan_terbaru: attachmentData.foto_sk_golongan_terbaru,
            foto_keterangan_tpp: attachmentData.foto_keterangan_tpp,
            foto_biaya_operasional: attachmentData.foto_biaya_operasional,
            foto_surat_kontrak: attachmentData.foto_surat_kontrak,
            foto_rekomendasi_bendahara:
              attachmentData.foto_rekomendasi_bendahara,
          },
        };

      case 'KEDINASAN_NON_MOU':
        return {
          kedinasan_non_mou: {
            pengajuan_id: attachmentData.pengajuan_id,
            instansi: attachmentData.instansi,
            surat_permohonan_kredit: attachmentData.surat_permohonan_kredit,
            surat_pernyataan_penjamin: attachmentData.surat_pernyataan_penjamin,
            surat_persetujuan_pimpinan:
              attachmentData.surat_persetujuan_pimpinan,
            surat_keterangan_gaji: attachmentData.surat_keterangan_gaji,
            foto_surat_kontrak: attachmentData.foto_surat_kontrak,
            foto_keterangan_tpp: attachmentData.foto_keterangan_tpp,
            foto_biaya_operasional: attachmentData.foto_biaya_operasional,
          },
        };

      case 'SHM':
        return {
          shm: {
            pengajuan_id: attachmentData.pengajuan_id,
            atas_nama_shm: attachmentData.atas_nama_shm,
            hubungan_shm: attachmentData.hubungan_shm,
            alamat_shm: attachmentData.alamat_shm,
            luas_shm: attachmentData.luas_shm,
            njop_shm: attachmentData.njop_shm,
            foto_shm: attachmentData.foto_shm,
            foto_kk_pemilik_shm: attachmentData.foto_kk_pemilik_shm,
            foto_pbb: attachmentData.foto_pbb,
            foto_objek_jaminan: attachmentData.foto_objek_jaminan,
            foto_buku_nikah_suami_istri:
              attachmentData.foto_buku_nikah_suami_istri,
            foto_npwp: attachmentData.foto_npwp,
            foto_imb: attachmentData.foto_imb,
            foto_surat_ahli_waris: attachmentData.foto_surat_ahli_waris,
            foto_surat_akte_kematian: attachmentData.foto_surat_akte_kematian,
            foto_surat_pernyataan_kepemilikan_tanah:
              attachmentData.foto_surat_pernyataan_kepemilikan_tanah,
            foto_surat_pernyataan_tidak_dalam_sengketa:
              attachmentData.foto_surat_pernyataan_tidak_dalam_sengketa,
          },
        };

      case 'UMKM':
        return {
          umkm: {
            pengajuan_id: attachmentData.pengajuan_id,
            foto_sku: attachmentData.foto_sku,
            foto_usaha: attachmentData.foto_usaha
              ? typeof attachmentData.foto_usaha === 'string'
                ? JSON.parse(attachmentData.foto_usaha[0])
                : attachmentData.foto_usaha[0]
              : [],
            foto_pembukuan: attachmentData.foto_pembukuan,
          },
        };

      default:
        return {};
    }
  }

  // ============================================================
  // HELPER: Map Other Loans with Details
  // ============================================================
  private mapOtherLoans(parentRows: any[], detailRows: any[]) {
    if (!parentRows || parentRows.length === 0) {
      return [];
    }

    console.log('🔍 Parent rows:', parentRows);
    console.log('🔍 Detail rows:', detailRows);

    return parentRows.map((parent) => {
      const cicilan = detailRows
        .filter((detail) => detail.other_exist_loan_id === parent.other_loan_id)

        .map((detail) => ({
          detail_item_id: detail.detail_item_id,
          nama_pembiayaan: detail.nama_pembiayaan,
          total_pinjaman: detail.total_pinjaman,
          cicilan_perbulan: detail.cicilan_perbulan,
          sisa_tenor: detail.sisa_tenor,
        }));

      console.log(
        `🔍 Cicilan for other_loan_id=${parent.other_loan_id}:`,
        cicilan,
      );

      return {
        other_loan_id: parent.other_loan_id,
        cicilan_lain: parent.cicilan_lain,
        validasi_pinjaman_lain: parent.validasi_pinjaman_lain,
        catatan: parent.catatan_pinjaman_lain,
        cicilan,
      };
    });
  }
}
