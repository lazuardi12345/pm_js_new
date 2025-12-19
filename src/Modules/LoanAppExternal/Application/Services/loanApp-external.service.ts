import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loanApp-external.repository';
import { LoanApplicationExternal } from '../../Domain/Entities/loanApp-external.entity';
import { CreateLoanApplicationExternalDto } from '../DTOS/dto-Loan-Application/create-loan-application.dto';
import { UpdateLoanApplicationExternalDto } from '../DTOS/dto-Loan-Application/update-loan-application.dto';

@Injectable()
export class LoanApplicationExternalService {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly repo: ILoanApplicationExternalRepository,
  ) {}

  async create(
    dto: CreateLoanApplicationExternalDto,
  ): Promise<LoanApplicationExternal> {
    const now = new Date();

    const entity = new LoanApplicationExternal(
      { id: dto.nasabah_id },
      dto.jenis_pembiayaan,
      dto.nominal_pinjaman,
      dto.tenor,
      dto.berkas_jaminan,
      dto.status_pinjaman,
      undefined,
      dto.pinjaman_ke,
      dto.pinjaman_terakhir,
      dto.sisa_pinjaman,
      dto.realisasi_pinjaman,
      dto.cicilan_perbulan,
      dto.status_pengajuan,
      dto.status_pengajuan_akhir,
      dto.validasi_pengajuan,
      dto.catatan_spv,
      dto.catatan_marketing,
      dto.is_banding,
      dto.alasan_banding,
      dto.survey_schedule,
      now,
      now,
      null,
    );

    return this.repo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateLoanApplicationExternalDto,
  ): Promise<LoanApplicationExternal> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Loan Application with ID ${id} not found`);
    }

    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanApplicationExternal> {
    const data = await this.repo.findById(id);
    if (!data) {
      throw new NotFoundException(`Loan Application with ID ${id} not found`);
    }
    return data;
  }

  async findAll(): Promise<LoanApplicationExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Loan Application with ID ${id} not found`);
    }
    return this.repo.delete(id);
  }
}
