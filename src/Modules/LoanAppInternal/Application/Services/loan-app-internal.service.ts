import { Injectable, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/loanApp-internal.repository';
import { LoanApplicationInternal } from '../../Domain/Entities/loan-application-internal.entity';
import { CreateLoanApplicationInternalDto } from '../DTOS/dto-LoanApp/create-loan-application.dto';
import { UpdateLoanAplicationInternalDto } from '../DTOS/dto-LoanApp/update-loan-application.dto';
import {
  StatusPengajuanEnum,
  StatusPinjamanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';
import {
  RoleSearchEnum,
  TypeSearchEnum,
} from 'src/Shared/Enums/General/General.enum';

@Injectable()
export class LoanApplicationInternalService {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly repo: ILoanApplicationInternalRepository,
  ) {}

  async create(
    dto: CreateLoanApplicationInternalDto,
  ): Promise<LoanApplicationInternal> {
    const now = new Date();
    const address = new LoanApplicationInternal(
      { id: dto.nasabah_id },
      dto.status_pinjaman ?? StatusPinjamanEnum.BARU,
      dto.nominal_pinjaman,
      dto.tenor,
      dto.keperluan,
      undefined,
      now,
      null,
      dto.status ?? StatusPengajuanEnum.PENDING,
      dto.pinjaman_ke,
      dto.riwayat_nominal,
      dto.riwayat_tenor,
      dto.sisa_pinjaman,
      dto.notes,
      dto.is_banding,
      dto.alasan_banding,
      now,
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateLoanAplicationInternalDto,
  ): Promise<LoanApplicationInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<LoanApplicationInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<LoanApplicationInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async searchLoans(
    role: RoleSearchEnum,
    type: TypeSearchEnum,
    keyword: string,
  ): Promise<{ data: any[] }> {
    return this.repo.callSP_GENERAL_GetAllPreviewDataLoanBySearch_Internal(
      role,
      type,
      keyword,
    );
  }
}
