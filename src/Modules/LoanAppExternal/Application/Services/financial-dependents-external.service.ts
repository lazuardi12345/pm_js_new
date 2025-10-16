import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  IFinancialDependentsExternalRepository,
  FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/financial-dependents-external.repository';
import { FinancialDependentsExternal } from '../../Domain/Entities/financial-dependents-external.entity';
import { CreateFinancialDependentsDto } from '../DTOS/dto-Financial-Dependents/create-financial-dependents.dto';
import { UpdateFinancialDependentsDto } from '../DTOS/dto-Financial-Dependents/update-financial-dependents.dto';

@Injectable()
export class FinancialDependentsExternalService {
  constructor(
    @Inject(FINANCIAL_DEPENDENTS_EXTERNAL_REPOSITORY)
    private readonly repo: IFinancialDependentsExternalRepository,
  ) { }

  async create(dto: CreateFinancialDependentsDto): Promise<FinancialDependentsExternal> {
    if (!dto.nasabah_id) {
      throw new BadRequestException('Nasabah ID harus diisi.');
    }

    const now = new Date();

    const newDependent = new FinancialDependentsExternal(
      { id: dto.nasabah_id },   // <-- wrap jadi objek dengan properti id
      dto.kondisi_tanggungan,
      dto.validasi_tanggungan,
      dto.catatan,
      undefined, // id otomatis
      now,
      now,
      null,
    );

    try {
      return await this.repo.save(newDependent);
    } catch (error) {
      console.error('Create Financial Dependent Error:', error);
      throw new InternalServerErrorException('Gagal membuat data financial dependent');
    }
  }

  async update(
    id: number,
    dto: UpdateFinancialDependentsDto,
  ): Promise<FinancialDependentsExternal> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Financial dependent dengan ID ${id} tidak ditemukan`);
    }

    // Buat instance baru dengan data gabungan update dan existing (immutable)
    const updatedData = new FinancialDependentsExternal(
      dto.nasabah_id !== undefined
        ? { id: dto.nasabah_id }
        : existing.nasabah,
      dto.kondisi_tanggungan ?? existing.kondisi_tanggungan,
      dto.validasi_tanggungan ?? existing.validasi_tanggungan,
      dto.catatan ?? existing.catatan,
      existing.id,
      existing.created_at,
      new Date(), // updated_at sekarang
      existing.deleted_at,
    );


    try {
      return await this.repo.update(id, updatedData);
    } catch (error) {
      console.error('Update Financial Dependent Error:', error);
      throw new InternalServerErrorException('Gagal mengupdate data financial dependent');
    }
  }

  async findById(id: number): Promise<FinancialDependentsExternal> {
    const data = await this.repo.findById(id);
    if (!data) {
      throw new NotFoundException(`Financial dependent dengan ID ${id} tidak ditemukan`);
    }
    return data;
  }

  async findAll(): Promise<FinancialDependentsExternal[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('Find All Financial Dependents Error:', error);
      throw new InternalServerErrorException('Gagal mengambil data financial dependents');
    }
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Financial dependent dengan ID ${id} tidak ditemukan`);
    }
    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error('Delete Financial Dependent Error:', error);
      throw new InternalServerErrorException('Gagal menghapus data financial dependent');
    }
  }
}
