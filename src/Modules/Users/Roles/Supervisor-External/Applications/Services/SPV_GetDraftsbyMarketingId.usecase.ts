import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY,
  ILoanApplicationDraftExternalRepository,
} from 'src/Shared/Modules/Drafts/Domain/Repositories/ext/LoanAppExt.repository';

@Injectable()
export class SPV_GetDraftByMarketingIdUseCase {
  constructor(
    @Inject(DRAFT_LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly createDraftRepo: ILoanApplicationDraftExternalRepository,
  ) {}

  async execute(marketingId: number): Promise<
    {
      nama_lengkap: string;
      no_ktp: string;
      no_hp: string;
      nominal_pinjaman: number;
      tenor: string | number;
      createdAt: Date | string;
      updatedAt: Date | string;
    }[]
  > {
    const drafts = await this.createDraftRepo.findByMarketingId(marketingId);

    if (!drafts.length) {
      throw new NotFoundException(
        `Tidak ada draft ditemukan untuk marketing ID ${marketingId}`,
      );
    }

    // Ambil hanya yang belum selesai
    const filteredDrafts = drafts.filter((d) => !d.isCompleted);

    if (!filteredDrafts.length) {
      throw new NotFoundException(
        `Tidak ada draft aktif untuk marketing ID ${marketingId}`,
      );
    }

    // Map hasil yang diformat
    const formattedDrafts = filteredDrafts.map((d: any) => ({
      id: d._id,
      nama_lengkap: d.client_internal?.nama_lengkap || '-',
      no_ktp: d.client_internal?.no_ktp || '-',
      no_hp: d.client_internal?.no_hp || '-',
      nominal_pinjaman: d.loan_application_internal?.nominal_pinjaman || 0,
      tenor: d.loan_application_internal?.tenor ?? 'Belum diset Marketing',
      createdAt: d.createdAt ?? '-',
      updatedAt: d.updatedAt ?? '-',
    }));

    return formattedDrafts;
  }
}
