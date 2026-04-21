import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { LoanAgreement } from 'src/Modules/Admin/Contracts/Domain/Entities/loan-agreements.entity';
import { UpdateLoanAgreementDto } from 'src/Modules/Admin/Contracts/Applications/DTOS/dto-Loan-Agreement/update-loan-agreement.dto';

import {
  ILoanAgreementRepository,
  LOAN_AGREEMENT_REPOSITORY,
} from 'src/Modules/Admin/Contracts/Domain/Repositories/loan-agreements.repository';

@Injectable()
export class AdCont_UpdateLoanAgreementUseCase {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly loanAgreementRepo: ILoanAgreementRepository,
  ) {}

  async execute(
    id: number,
    dto: UpdateLoanAgreementDto,
  ): Promise<LoanAgreement> {
    const existingLoan = await this.loanAgreementRepo.findById(id);
    if (!existingLoan) {
      throw new NotFoundException('Loan Agreement not found');
    }

    const updatedEntity = new LoanAgreement(
      dto.nomor_kontrak ?? existingLoan.nomor_kontrak,
      dto.nama ?? existingLoan.nama,
      dto.alamat ?? existingLoan.alamat,
      dto.no_ktp ?? existingLoan.no_ktp,
      dto.type ?? existingLoan.type,
      dto.pokok_pinjaman ?? existingLoan.pokok_pinjaman,
      dto.tenor ?? existingLoan.tenor,
      dto.biaya_admin ?? existingLoan.biaya_admin,
      dto.cicilan ?? existingLoan.cicilan,
      dto.biaya_layanan ?? existingLoan.biaya_layanan,
      dto.bunga ?? existingLoan.bunga,
      dto.tanggal_jatuh_tempo ?? existingLoan.tanggal_jatuh_tempo,
      id,
      dto.nomor_urut ?? existingLoan.nomor_urut,
      dto.perusahaan ?? existingLoan.perusahaan,
      dto.inisial_marketing ?? existingLoan.inisial_marketing,
      dto.golongan ?? existingLoan.golongan,
      dto.inisial_ca ?? existingLoan.inisial_ca,
      dto.id_card ?? existingLoan.id_card,
      dto.kedinasan ?? existingLoan.kedinasan,
      dto.pinjaman_ke ?? existingLoan.pinjaman_ke,
      dto.jenis_jaminan ?? existingLoan.jenis_jaminan,
      dto.daerah ?? existingLoan.daerah,
      dto.tipe_pekerja ?? existingLoan.tipe_pekerja,
      dto.sub_type ?? existingLoan.sub_type,
      dto.potongan ?? existingLoan.potongan,
      dto.pay_type ?? existingLoan.pay_type,
      dto.catatan ?? existingLoan.catatan,
      existingLoan.created_at,
      existingLoan.deleted_at,
      new Date(),
    );

    return await this.loanAgreementRepo.update(id, updatedEntity);
  }
}
