// Applications/UseCases/AdAR_SearchClientLoanAgreement.usecase.ts

import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import {
  ILoanAgreementRepository,
  LOAN_AGREEMENT_REPOSITORY,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/loan-agreements.repository';
import { AdAr_GetAllClientSearchDataDto } from './DTOS/AdAr_GetAllClientSearchData.dto';

@Injectable()
export class AdAR_GetAllClientSearchDataUseCase {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly loanAgreementRepo: ILoanAgreementRepository,
  ) {}

  async execute(dto: AdAr_GetAllClientSearchDataDto) {
    try {
      const result =
        await this.loanAgreementRepo.callSP_AdAR_GetAllClientSearchData(
          dto.nama?.trim() || null,
          dto.no_ktp ? Number(dto.no_ktp) : null,
          dto.id_card?.trim() || null,
        );

      const rawData = result[0] || [];

      if (!rawData.length) {
        return {
          payload: {
            success: true,
            message: 'Data tidak ditemukan',
            reference: 'SEARCH_CLIENT_LOAN_AGREEMENT_EMPTY',
            data: [],
          },
        };
      }

      const mappedData = rawData.map((item: any) => ({
        client_id: item?.client_id ?? '-',
        id_card: item?.id_card ?? '-',
        contract_number: item?.nomor_kontrak ?? '-',
        residentID: item?.no_ktp ?? '-',
        client_name: item?.nama ?? '-',
        company_name: item?.perusahaan ?? '-',
      }));

      return {
        payload: {
          success: true,
          message: 'Data berhasil ditemukan',
          reference: 'SEARCH_CLIENT_LOAN_AGREEMENT_OK',
          total: mappedData.length,
          data: mappedData,
        },
      };
    } catch (err) {
      console.error('[AdAR_SearchClientLoanAgreement]', err);

      return {
        payload: {
          success: false,
          message: err.message || 'Gagal melakukan pencarian',
          reference: 'SEARCH_CLIENT_LOAN_AGREEMENT_ERROR',
        },
      };
    }
  }
}
