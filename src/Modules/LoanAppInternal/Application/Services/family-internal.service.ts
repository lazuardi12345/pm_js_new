import { Injectable, Inject } from '@nestjs/common';
import {
  IFamilyInternalRepository,
  FAMILY_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/family-internal.repository';
import { FamilyInternal } from '../../Domain/Entities/family-internal.entity';
import { CreateFamilyDto } from '../DTOS/dto-Family/create-family-internal.dto';
import { UpdateFamilyDto } from '../DTOS/dto-Family/update-family-internal.dto';

@Injectable()
export class FamilyInternalService {
  constructor(
    @Inject(FAMILY_INTERNAL_REPOSITORY)
    private readonly repo: IFamilyInternalRepository,
  ) {}

  async create(dto: CreateFamilyDto): Promise<FamilyInternal> {
    const now = new Date();
    const address = new FamilyInternal(
      {id: dto.nasabah_id},
      dto.hubungan,
      dto.nama,
      dto.bekerja,
      undefined,
      now,
      null,
      
      dto.nama_perusahaan,
      dto.jabatan,
      dto.penghasilan,
      dto.alamat_kerja,
      dto.no_hp,
      now,
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateFamilyDto): Promise<FamilyInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<FamilyInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<FamilyInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
