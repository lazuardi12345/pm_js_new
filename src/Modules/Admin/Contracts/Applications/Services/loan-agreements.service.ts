import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanAgreementRepository,
  LOAN_AGREEMENT_REPOSITORY,
} from '../../Domain/Repositories/loan-agreements.repository';
import { LoanAgreement } from '../../Domain/Entities/loan-agreements.entity';
import { CreateLoanAgreementDto } from '../DTOS/dto-Loan-Agreement/create-loan-agreement.dto';
import { UpdateLoanAgreementDto } from '../DTOS/dto-Loan-Agreement/update-loan-agreement.dto';
@Injectable()
export class LoanAgreementService {
  constructor(
    @Inject(LOAN_AGREEMENT_REPOSITORY)
    private readonly repo: ILoanAgreementRepository,
  ) {}

  async create(dto: CreateLoanAgreementDto): Promise<LoanAgreement> {
    const now = new Date();

    const address = new LoanAgreement(
      dto.nomor_kontrak,
      dto.nama,
      dto.alamat,
      dto.no_ktp,
      dto.type,
      dto.pokok_pinjaman,
      dto.tenor,
      dto.biaya_admin,
      dto.cicilan,
      dto.biaya_layanan,
      dto.bunga,
      dto.tanggal_jatuh_tempo,
      undefined,
      dto.nomor_urut,
      dto.perusahaan,
      dto.inisial_marketing,
      dto.golongan,
      dto.inisial_ca,
      dto.id_card,
      dto.kedinasan,
      dto.pinjaman_ke,
      dto.catatan,
      now,
      null,
      now,
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateLoanAgreementDto,
  ): Promise<LoanAgreement> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanAgreement | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<LoanAgreement[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
