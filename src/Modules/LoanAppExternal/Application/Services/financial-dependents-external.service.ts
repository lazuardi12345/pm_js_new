import { Injectable, Inject } from '@nestjs/common';
import {
    IFinancialDependentsExternalRepository,
    FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY,
  } from '../../Domain/Repositories/financial-dependents-external.repository';
import { FinancialDependentsExternal } from '../../Domain/Entities/financial-dependents-external.entity';
import { CreateFinancialDependentsDto } from '../DTOS/dto-Financial-Dependents/create-financial-dependents.dto';
import { UpdateFinancialDependentsDto } from '../DTOS/dto-Financial-Dependents/update-financial-dependents.dto';

@Injectable()
export class EmergencyContactExternalService {
  constructor(
    @Inject(FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY)
    private readonly repo: IFinancialDependentsExternalRepository,
  ) {}

  async create(dto: CreateFinancialDependentsDto): Promise<FinancialDependentsExternal> {
    const now = new Date();

    const address = new FinancialDependentsExternal(
    dto.nasabah_id,              // nasabahId
    dto.kondisi_tanggungan,      // kondisiTanggungan (optional)
    dto.validasi_tanggungan,     // validasiTanggungan (optional)
    dto.catatan,                // catatan (optional)
    undefined,                  // id (optional)
    now,                        // createdAt
    now,                        // updatedAt
    null                        // deletedAt
    );
    return this.repo.save(address);
  }

  async update(
    id: number,
    dto: UpdateFinancialDependentsDto,
  ): Promise<FinancialDependentsExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<FinancialDependentsExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<FinancialDependentsExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
