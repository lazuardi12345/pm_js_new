import { Injectable, Inject } from '@nestjs/common';
import { IRelativesInternalRepository, RELATIVE_INTERNAL_REPOSITORY } from '../../Domain/Repositories/relatives-internal.repository';
import { RelativesInternal } from '../../Domain/Entities/relative-internal.entity';
import { CreateRelativeInternalDto } from '../DTOS/dto-Relatives/create-relatives-internal.dto';
import { UpdateRelativeInternalDto } from '../DTOS/dto-Relatives/update-relatives-internal.dto';

@Injectable()
export class RelativeInternalService {
  constructor(
    @Inject(RELATIVE_INTERNAL_REPOSITORY)
    private readonly repo: IRelativesInternalRepository,
  ) {}

  async create(dto: CreateRelativeInternalDto): Promise<RelativesInternal> {
    const now = new Date();
    const address = new RelativesInternal(
      {id: dto.nasabah_id},
      dto.kerabat_kerja,
      undefined,
      dto.nama,
      dto.alamat,
      dto.no_hp,
      dto.status_hubungan,
      dto.nama_perusahaan,
      now,
      now,
      null,
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateRelativeInternalDto): Promise<RelativesInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<RelativesInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<RelativesInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
