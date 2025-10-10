import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanGuarantorExternalRepository,
  LOAN_GUARANTOR_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loan-guarantor-external.repository';
import { LoanGuarantorExternal } from '../../Domain/Entities/loan-guarantor-external.entity';
import { CreateLoanGuarantorExternalDto } from '../DTOS/dto-Loan-Guarantor/create-loan-guarantor.dto';
import { UpdateLoanGuarantorExternalDto } from '../DTOS/dto-Loan-Guarantor/update-loan-guarantor.dto';
@Injectable()
export class EmergencyContactExternalService {
  constructor(
    @Inject(LOAN_GUARANTOR_EXTERNAL_REPOSITORY)
    private readonly repo: ILoanGuarantorExternalRepository,
  ) {}

  async create(
    dto: CreateLoanGuarantorExternalDto,
  ): Promise<LoanGuarantorExternal> {
    const now = new Date();

    const address = new LoanGuarantorExternal(
      dto.nasabah_id, // nasabahId
      dto.hubungan_penjamin, // hubunganPenjamin
      dto.nama_penjamin, // namaPenjamin
      dto.pekerjaan_penjamin, // pekerjaanPenjamin
      dto.penghasilan_penjamin, // penghasilanPenjamin
      dto.no_hp_penjamin, // noHpPenjamin
      dto.persetujuan_penjamin, // persetujuanPenjamin
      dto.foto_ktp_penjamin, // fotoKtpPenjamin
      undefined, // id
      dto.validasi_penjamin, // validasiPenjamin (optional)
      dto.catatan, // catatan (optional)
      now, // createdAt
      now, // updatedAt
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateLoanGuarantorExternalDto,
  ): Promise<LoanGuarantorExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanGuarantorExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<LoanGuarantorExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
