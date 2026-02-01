// src/Modules/LoanAppExternal/Application/UseCases/AdCont_GetLoanApplicationByIdExternal_UseCase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';

@Injectable()
export class AdCont_GetLoanDetailByIdInternalUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
  ) {}

  async execute(id: number) {
    try {
      const result =
        await this.loanAppRepo.callSP_AdCont_GetLoanDetailById_Internal(id);

      // SP cuma return 1 result set
      const loanData = result?.[0]?.[0];

      if (!loanData) {
        throw new NotFoundException(`Loan Application with id ${id} not found`);
      }

      return {
        payload: {
          error: false,
          message: 'Loan Application Detail retrieved successfully',
          reference: 'LOAN_DETAIL_OK',
          data: {
            client_and_loan_detail: {
              loan_application_internal: {
                loan_app_id: loanData.loan_app_id,
                loan_amount: this.formatCurrency(loanData.loan_amount),
                tenor: loanData.tenor ?? '-',
                pinjaman_ke: loanData.pinjaman_ke ?? '-',
                status_pinjaman: loanData.status_pinjaman ?? '-',
                keperluan: loanData.keperluan ?? '-',
                loan_notes: loanData.loan_notes ?? '-',
                loan_is_banding: loanData.loan_is_banding ?? 0,
                loan_alasan_banding: loanData.loan_alasan_banding ?? '-',
              },
              client_internal: {
                client_id: loanData.client_id,
                nama_lengkap: loanData.nama_lengkap ?? '-',
                tipe_nasabah: loanData.tipe_nasabah ?? '-',
                no_ktp: loanData.no_ktp ?? '-',
                jenis_kelamin: loanData.jenis_kelamin ?? '-',
                tempat_lahir: loanData.tempat_lahir ?? '-',
                tanggal_lahir: loanData.tanggal_lahir
                  ? new Date(loanData.tanggal_lahir).toISOString().split('T')[0]
                  : '-',
                no_hp: loanData.no_hp ?? '-',
                status_nikah: loanData.status_nikah ?? '-',
                email: loanData.email ?? '-',
                no_rekening: loanData.no_rekening ?? '-',
                foto_ktp: loanData.foto_ktp ?? '-',
                foto_kk: loanData.foto_kk ?? '-',
                foto_id_card: loanData.foto_id_card ?? '-',
                foto_rekening: loanData.foto_rekening ?? '-',
              },
              address_internal: {
                alamat_ktp: loanData.alamat_ktp ?? '-',
                kelurahan: loanData.kelurahan ?? '-',
                rt_rw: loanData.rt_rw ?? '-',
                kecamatan: loanData.kecamatan ?? '-',
                kota: loanData.kota ?? '-',
                provinsi: loanData.provinsi ?? '-',
                domisili: loanData.domisili ?? '-',
                status_rumah_ktp: loanData.status_rumah_ktp ?? '-',
                status_rumah: loanData.status_rumah ?? '-',
                alamat_lengkap: loanData.alamat_lengkap ?? '-',
              },
              job_internal: {
                perusahaan: loanData.perusahaan ?? '-',
                divisi: loanData.divisi ?? '-',
                lama_kerja_tahun: loanData.lama_kerja_tahun ?? '-',
                lama_kerja_bulan: loanData.lama_kerja_bulan ?? '-',
                golongan: loanData.golongan ?? '-',
                yayasan: loanData.yayasan ?? '-',
                nama_atasan: loanData.nama_atasan ?? '-',
                nama_hrd: loanData.nama_hrd ?? '-',
                absensi: loanData.absensi ?? '-',
                bukti_absensi_file: loanData.bukti_absensi_file ?? '-',
              },
              family_internal: {
                family_hubungan: loanData.family_hubungan ?? '-',
                nama_keluarga: loanData.nama_keluarga ?? '-',
                family_bekerja: loanData.family_bekerja ?? '-',
                family_nama_perusahaan: loanData.family_nama_perusahaan ?? '-',
                family_jabatan: loanData.family_jabatan ?? '-',
                family_penghasilan: this.formatCurrency(
                  loanData.family_penghasilan,
                ),
                family_alamat_kerja: loanData.family_alamat_kerja ?? '-',
                no_hp_keluarga: loanData.no_hp_keluarga ?? '-',
              },
              collateral_internal: {
                jaminan_hrd: loanData.jaminan_hrd ?? '-',
                jaminan_cg: loanData.jaminan_cg ?? '-',
                penjamin: loanData.penjamin ?? '-',
                nama_penjamin: loanData.nama_penjamin ?? '-',
                lama_kerja_penjamin: loanData.lama_kerja_penjamin ?? '-',
                bagian: loanData.bagian ?? '-',
                collateral_absensi: loanData.collateral_absensi ?? '-',
                riwayat_pinjam_penjamin:
                  loanData.riwayat_pinjam_penjamin ?? '-',
                riwayat_nominal_penjamin: this.formatCurrency(
                  loanData.riwayat_nominal_penjamin,
                ),
                riwayat_tenor_penjamin: loanData.riwayat_tenor_penjamin ?? '-',
                sisa_pinjaman_penjamin: this.formatCurrency(
                  loanData.sisa_pinjaman_penjamin,
                ),
                jaminan_cg_penjamin: loanData.jaminan_cg_penjamin ?? '-',
                status_hubungan_penjamin:
                  loanData.status_hubungan_penjamin ?? '-',
                foto_id_card_penjamin: loanData.foto_id_card_penjamin ?? '-',
                foto_ktp_penjamin: loanData.foto_ktp_penjamin ?? '-',
              },
              relative_internal: {
                kerabat_kerja: loanData.kerabat_kerja ?? '-',
                nama_kerabat_kerja: loanData.nama_kerabat_kerja ?? '-',
                alamat_kerabat_kerja: loanData.alamat_kerabat_kerja ?? '-',
                no_hp_kerabat_kerja: loanData.no_hp_kerabat_kerja ?? '-',
                nama_perusahaan_kerabat_kerja:
                  loanData.nama_perusahaan_kerabat_kerja ?? '-',
                status_hubungan_kerabat_kerja:
                  loanData.status_hubungan_kerabat_kerja ?? '-',
              },
            },
            loan_application_status: {
              spv: {
                data: {
                  spv_name: loanData.spv_app_name ?? '-',
                  spv_response: loanData.spv_app_status ?? '-',
                  spv_conclusion: loanData.spv_app_conclusion ?? '-',
                },
              },
              ca: {
                data: {
                  ca_name: loanData.ca_app_name ?? '-',
                  ca_response: loanData.ca_app_status ?? '-',
                  ca_conclusion: loanData.ca_app_conclusion ?? '-',
                },
              },
              hm: {
                data: {
                  hm_name: loanData.hm_app_name ?? '-',
                  hm_response: loanData.hm_app_status ?? '-',
                  hm_conclusion: loanData.hm_app_conclusion ?? '-',
                },
              },
            },
            loan_appeal_status: {
              ca: {
                data: {
                  ca_name: loanData.ca_appeal_name ?? '-',
                  ca_response: loanData.ca_appeal_status ?? '-',
                  ca_conclusion: loanData.ca_appeal_conclusion ?? '-',
                },
              },
              hm: {
                data: {
                  hm_name: loanData.hm_appeal_name ?? '-',
                  hm_response: loanData.hm_appeal_status ?? '-',
                  hm_conclusion: loanData.hm_appeal_conclusion ?? '-',
                },
              },
            },
          },
        },
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      return {
        payload: {
          error: true,
          message: err.message || 'Failed to get loan application detail',
          reference: 'LOAN_DETAIL_ERROR',
        },
      };
    }
  }

  private formatCurrency(amount: number | string | null): string {
    if (!amount || amount === 0) return 'Rp. 0';

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Rp. ${numAmount.toLocaleString('id-ID')}`;
  }

  private formatDate(date: string | Date | null): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
