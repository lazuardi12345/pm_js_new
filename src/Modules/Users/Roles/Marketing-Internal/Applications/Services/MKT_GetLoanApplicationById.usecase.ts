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
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

import {
  TypeLoanApplicationDetail,
  TypeApprovalDetail,
  TypeStatusApproval,
} from '../DTOS/MKT_CreateLoanApplication.dto';
import {
  APPROVAL_RECOMMENDATION_REPOSITORY,
  IApprovalRecommendationRepository,
} from 'src/Modules/Admin/BI-Checking/Domain/Repositories/approval-recommendation.repository';
import {
  DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY,
  ILoanApplicationDraftInternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/int/LoanAppInt.repository';

@Injectable()
export class MKT_GetLoanApplicationByIdUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(APPROVAL_RECOMMENDATION_REPOSITORY)
    private readonly approvalRecomRepo: IApprovalRecommendationRepository,
    @Inject(DRAFT_LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppDraftRepo: ILoanApplicationDraftInternalRepository,
  ) {}

  async execute(id: number) {
    try {
      if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('Invalid loan application ID');
      }
      const result =
        await this.loanAppRepo.callSP_MKT_GetDetail_LoanApplicationsInternal_ById(
          id,
        );

      if (!result || !Array.isArray(result)) {
        throw new InternalServerErrorException(
          'Stored Procedure returned invalid result format',
        );
      }

      const [loanDataRows, approvals]: [
        TypeLoanApplicationDetail[] | undefined,
        TypeApprovalDetail[] | undefined,
      ] = result as any;

      const loanData = loanDataRows?.[0];

      if (!loanData) {
        throw new NotFoundException(`Loan Application with id ${id} not found`);
      }

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

      const loanAppStatus: Record<string, TypeStatusApproval | null> = {};
      const appealStatus: Record<string, TypeStatusApproval | null> = {};

      // --- MAP ROLE KE KEY ---
      const roleMap: Record<string | number, string> = {
        SPV: 'spv',
        Supervisor: 'spv',
        1: 'spv',

        HM: 'hm',
        'Head Marketing': 'hm',
        3: 'hm',
      };

      // --- PROSES APPROVAL ---
      (approvals ?? []).forEach((approval: TypeApprovalDetail) => {
        if (!approval) return;

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

      // --- RETURN NORMAL ---
      return {
        error: false,
        message: 'Loan Application Detail by ID retrieved successfully',
        reference: 'LOAN_RETRIEVE_OK',
        data: {
          client_and_loan_detail: {
            clients_internal: {
              client_id: loanData.client_id,
              nama_lengkap: loanData.nama_lengkap,
              no_ktp: loanData.no_ktp,
              jenis_kelamin: loanData.jenis_kelamin,
              tempat_lahir: loanData.tempat_lahir,
              tanggal_lahir: new Date(loanData.tanggal_lahir)
                .toISOString()
                .split('T')[0],
              no_hp: loanData.no_hp,
              status_nikah: loanData.status_nikah,
              email: loanData.email,
              no_rekening: loanData.no_rekening,
              tipe_nasabah: loanData.tipe_nasabah,
            },
            address_internal: {
              alamat_ktp: loanData.alamat_ktp,
              kelurahan: loanData.kelurahan,
              rt_rw: loanData.rt_rw,
              kecamatan: loanData.kecamatan,
              kota: loanData.kota,
              provinsi: loanData.provinsi,
              status_rumah_ktp: loanData.status_rumah_ktp,
              status_rumah: loanData.status_rumah,
              domisili: loanData.domisili,
              alamat_lengkap: loanData.alamat_lengkap,
            },
            collateral_internal: {
              jaminan_hrd: loanData.jaminan_hrd,
              jaminan_cg: loanData.jaminan_cg,
              penjamin: loanData.penjamin,
              nama_penjamin: loanData.nama_penjamin,
              lama_kerja_penjamin: loanData.lama_kerja_penjamin,
              bagian: loanData.bagian,
              absensi: loanData.absensi,
              riwayat_pinjam_penjamin: loanData.riwayat_pinjam_penjamin,
              riwayat_nominal_penjamin: loanData.riwayat_nominal_penjamin,
              riwayat_tenor_penjamin: loanData.riwayat_tenor_penjamin,
              sisa_pinjaman_penjamin: loanData.sisa_pinjaman_penjamin,
              jaminan_cg_penjamin: loanData.jaminan_cg_penjamin,
              status_hubungan_penjamin: loanData.status_hubungan_penjamin,
            },
            family_internal: {
              hubungan: loanData.family_hubungan,
              nama: loanData.nama_keluarga,
              bekerja: loanData.bekerja,
              nama_perusahaan: loanData.nama_perusahaan,
              jabatan: loanData.jabatan,
              penghasilan: loanData.penghasilan,
              alamat_kerja: loanData.alamat_kerja,
              no_hp: loanData.no_hp_keluarga,
            },
            job_internal: {
              perusahaan: loanData.perusahaan,
              divisi: loanData.divisi,
              lama_kerja_tahun: loanData.lama_kerja_tahun,
              lama_kerja_bulan: loanData.lama_kerja_bulan,
              golongan: loanData.golongan,
              yayasan: loanData.yayasan,
              nama_atasan: loanData.nama_atasan,
              nama_hrd: loanData.nama_hrd,
              absensi: loanData.absensi,
            },
            loan_internal: {
              status_pinjaman: loanData.status_pinjaman,
              nominal_pinjaman: loanData.nominal_pinjaman,
              pinjaman_ke: loanData.pinjaman_ke,
              tenor: loanData.tenor,
              keperluan: loanData.keperluan,
              status: loanData.status,
              riwayat_nominal: loanData.riwayat_nominal,
              riwayat_tenor: loanData.riwayat_tenor,
              sisa_pinjaman: loanData.sisa_pinjaman,
              notes: loanData.notes,
              is_banding: loanData.loan_is_banding,
              alasan_banding: loanData.loan_alasan_banding,
            },
            relatives_internal: {
              kerabat_kerja: loanData.kerabat_kerja,
              nama: loanData.nama_kerabat_kerja,
              alamat: loanData.alamat_kerabat_kerja,
              no_hp: loanData.no_hp_kerabat_kerja,
              status_hubungan: loanData.status_hubungan_kerabat_kerja,
              nama_perusahaan: loanData.nama_perusahaan_kerabat_kerja,
            },
            documents_files: {
              foto_ktp: loanData.foto_ktp,
              foto_kk: loanData.foto_kk,
              foto_id_card: loanData.foto_id_card,
              foto_rekening: loanData.foto_rekening,
              foto_id_card_penjamin: loanData.foto_id_card_penjamin,
              foto_ktp_penjamin: loanData.foto_ktp_penjamin,
              bukti_absensi_file: loanData.bukti_absensi_file,
            },
            approval_recommendation,
          },
          loan_app_status: loanAppStatus,
          appeal_status: appealStatus,
        },
      };
    } catch (err) {
      // --- ERROR DARI NEST / HTTP ---
      if (err instanceof HttpException) throw err;

      // --- UNEXPECTED ERROR ---
      console.error('Unexpected error:', err);

      throw new InternalServerErrorException(
        'Unexpected error while retrieving loan application detail',
      );
    }
  }
}
