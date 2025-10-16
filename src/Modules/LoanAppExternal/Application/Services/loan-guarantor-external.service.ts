import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanGuarantorExternalRepository,
  LOAN_GUARANTOR_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loan-guarantor-external.repository';
import { LoanGuarantorExternal } from '../../Domain/Entities/loan-guarantor-external.entity';
import { CreateLoanGuarantorExternalDto } from '../DTOS/dto-Loan-Guarantor/create-loan-guarantor.dto';
import { UpdateLoanGuarantorExternalDto } from '../DTOS/dto-Loan-Guarantor/update-loan-guarantor.dto';
@Injectable()
export class LoanGuarantorExternalService {
  constructor(
    @Inject(LOAN_GUARANTOR_EXTERNAL_REPOSITORY)
    private readonly repo: ILoanGuarantorExternalRepository,
  ) {}

  async create(
    dto: CreateLoanGuarantorExternalDto,
  ): Promise<LoanGuarantorExternal> {
    const now = new Date();

    const address = new LoanGuarantorExternal(
     {id: dto.nasabah_id},
      dto.hubungan_penjamin, 
      dto.nama_penjamin, 
      dto.pekerjaan_penjamin, 
      dto.penghasilan_penjamin, 
      dto.no_hp_penjamin, 
      dto.persetujuan_penjamin,
      dto.foto_ktp_penjamin,
      undefined, // id
      dto.validasi_penjamin, 
      dto.catatan, 
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
