// src/Modules/LoanAppExternal/Application/UseCases/AdCont_GetLoanApplicationByIdExternal_UseCase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';

@Injectable()
export class AdCont_GetLoanDetailByIdExternalUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
  ) {}

  async execute(id: number) {
    try {
      const result =
        await this.loanAppRepo.callSP_AdCont_GetLoanDetailById_External(id);

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
              loan_application_external: {
                loan_app_id: loanData.loan_app_id,
                jenis_pembiayaan: loanData.jenis_pembiayaan ?? '-',
                loan_amount: this.formatCurrency(loanData.loan_amount),
                tenor: loanData.tenor ?? '-',
                pinjaman_ke: loanData.pinjaman_ke ?? '-',
                status_pengajuan: loanData.status_pengajuan ?? '-',
                status: loanData.status ?? '-',
                keperluan: loanData.keperluan ?? '-',
                marketing_notes: loanData.marketing_notes ?? '-',
                supervisor_notes: loanData.supervisor_notes ?? '-',
                loan_submitted_at: this.formatDate(loanData.loan_submitted_at),
                loan_is_banding: loanData.loan_is_banding ?? 0,
                loan_alasan_banding: loanData.loan_alasan_banding ?? '-',
              },
              client_external: {
                client_id: loanData.client_id,
                nama_lengkap: loanData.nama_lengkap ?? '-',
                nik: loanData.nik ?? '-',
                no_kk: loanData.no_kk ?? '-',
                foto_ktp_peminjam: loanData.foto_ktp_peminjam ?? '-',
                foto_kk_peminjam: loanData.foto_kk_peminjam ?? '-',
                tempat_lahir: loanData.tempat_lahir ?? '-',
                tanggal_lahir: loanData.tanggal_lahir
                  ? new Date(loanData.tanggal_lahir).toISOString().split('T')[0]
                  : '-',
                jenis_kelamin: loanData.jenis_kelamin ?? '-',
                no_hp: loanData.no_hp ?? '-',
                email: loanData.email ?? '-',
                status_nikah: loanData.status_nikah ?? '-',
                no_rekening: loanData.no_rekening ?? '-',
              },
              address_external: {
                alamat_ktp: loanData.alamat_ktp ?? '-',
                rt_rw: loanData.rt_rw ?? '-',
                kelurahan: loanData.kelurahan ?? '-',
                kecamatan: loanData.kecamatan ?? '-',
                kota: loanData.kota ?? '-',
                provinsi: loanData.provinsi ?? '-',
                status_rumah: loanData.status_rumah ?? '-',
                domisili: loanData.domisili ?? '-',
                alamat_domisili: loanData.alamat_domisili ?? '-',
                lama_tinggal: loanData.lama_tinggal ?? '-',
              },
              job_external: {
                perusahaan: loanData.perusahaan ?? '-',
                alamat_perusahaan: loanData.alamat_perusahaan ?? '-',
                kontak_perusahaan: loanData.kontak_perusahaan ?? '-',
                jabatan: loanData.jabatan ?? '-',
                lama_kerja: loanData.lama_kerja ?? '-',
                status_karyawan: loanData.status_karyawan ?? '-',
                pendapatan_perbulan: this.formatCurrency(
                  loanData.pendapatan_perbulan,
                ),
              },
              emergency_contact_external: {
                nama_kontak_darurat: loanData.nama_kontak_darurat ?? '-',
                hubungan_kontak_darurat:
                  loanData.hubungan_kontak_darurat ?? '-',
                no_hp_kontak_darurat: loanData.no_hp_kontak_darurat ?? '-',
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
        error: true,
        message: err.message || 'Failed to get loan application detail',
        reference: 'LOAN_DETAIL_ERROR',
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
