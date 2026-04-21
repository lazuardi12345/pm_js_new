// src/Modules/LoanAppExternal/Application/UseCases/AdCont_GetLoanInquiry_UseCase.ts
import { Injectable, Inject } from '@nestjs/common';
import {
  LOAN_AGREEMENT_REPOSITORY,
  ILoanAgreementRepository,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/loan-agreements.repository';

@Injectable()
export class AdCont_GetLoanInquiryUseCase {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly loanAggreementRepo: ILoanAgreementRepository,
  ) {}

  async execute(nik: string) {
    try {
      const result =
        await this.loanAggreementRepo.callSP_AdCont_GetLoanInquiry(nik);

      if (!result || result.length === 0) {
        return {
          payload: {
            success: false,
            message: 'NIK not found',
            reference: 'LOAN_INQUIRY_NIK_NOT_FOUND',
            data: null,
          },
        };
      }

      const raw = result[0];

      // Guard: SP returned NIK_NOT_FOUND error row
      if (raw?.error_code === 'NIK_NOT_FOUND') {
        return {
          payload: {
            success: false,
            message: 'NIK tidak ditemukan di sistem',
            reference: 'LOAN_INQUIRY_NIK_NOT_FOUND',
            data: null,
          },
        };
      }

      const data = {
        // Identitas
        client_name: raw?.nama_lengkap ?? '-',
        client_type: raw?.client_type ?? '-',

        // Loan — latest record
        loan: {
          loan_frequency: Number(raw?.pinjaman_ke ?? 0),
          loan_amount: raw?.nominal_pinjaman,
          loan_tenor: raw?.tenor ?? '-',
        },

        // Alamat — field berbeda per client type
        address:
          raw?.client_type === 'INTERNAL'
            ? {
                residentID_card_address: raw?.alamat_ktp ?? '-',
                complete_address: raw?.alamat_lengkap ?? '-',
              }
            : {
                residentID_card_address: raw?.alamat_ktp ?? '-',
                complete_address: raw?.alamat_domisili ?? '-',
              },

        // ID Card
        id_card: raw?.foto_id_card ?? null,
      };

      return {
        payload: {
          error: false,
          message: 'Loan inquiry retrieved successfully',
          reference: 'LOAN_INQUIRY_OK',
          data,
        },
      };
    } catch (err) {
      return {
        payload: {
          error: true,
          message: err.message || 'Failed to get loan inquiry',
          reference: 'LOAN_INQUIRY_ERROR',
        },
      };
    }
  }
}
