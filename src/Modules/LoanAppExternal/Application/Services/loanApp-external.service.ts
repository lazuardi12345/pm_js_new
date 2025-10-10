import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loanApp-external.repository';
import { LoanApplicationExternal } from '../../Domain/Entities/loanApp-external.entity';
import { CreateLoanApplicationExternalDto } from '../DTOS/dto-Loan-Application/create-loan-application.dto';
import { UpdateLoanApplicationExternalDto } from '../DTOS/dto-Loan-Application/update-loan-application.dto';
export class EmergencyContactExternalService {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly repo: ILoanApplicationExternalRepository,
  ) {}

  async create(
    dto: CreateLoanApplicationExternalDto,
  ): Promise<LoanApplicationExternal> {
    const now = new Date();

    const address = new LoanApplicationExternal(
      dto.nasabah_id, // nasabahId
      dto.jenis_pembiayaan, // jenisPembiayaan
      dto.nominal_pinjaman, // nominalPinjaman
      dto.tenor, // tenor
      dto.berkas_jaminan, // berkasJaminan
      dto.status_pinjaman, // statusPinjaman (default: BARU)
      undefined, // id
      dto.pinjaman_ke, // pinjamanKe (optional)
      dto.pinjaman_terakhir, // pinjamanTerakhir (optional)
      dto.sisa_pinjaman, // sisaPinjaman (optional)
      dto.realisasi_pinjaman, // realisasiPinjaman (optional)
      dto.cicilan_perbulan, // cicilanPerbulan (optional)
      dto.status_pengajuan, // statusPengajuan (default: PENDING)
      dto.validasi_pengajuan, // validasiPengajuan (optional)
      dto.catatan, // catatan (optional)
      dto.catatan_spv, // catatanSpv (optional)
      dto.catatan_marketing, // catatanMarketing (optional)
      dto.is_banding, // isBanding (default: false)
      dto.alasan_banding, // alasanBanding (optional)
      now, // createdAt
      now, // updatedAt
      undefined
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateLoanApplicationExternalDto,
  ): Promise<LoanApplicationExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanApplicationExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<LoanApplicationExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
