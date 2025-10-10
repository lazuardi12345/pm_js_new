import { Injectable, Inject } from '@nestjs/common';
import { IJobInternalRepository, JOB_INTERNAL_REPOSITORY } from '../../Domain/Repositories/job-internal.repository';
import { JobInternal } from '../../Domain/Entities/job-internal.entity';
import { CreateJobDto } from '../DTOS/dto-Job/create-job-internal.dto';
import { UpdateJobDto } from '../DTOS/dto-Job/update-job-internal.dto';

@Injectable()
export class JobInternalService {
  constructor(
    @Inject(JOB_INTERNAL_REPOSITORY)
    private readonly repo: IJobInternalRepository,
  ) {}

  async create(dto: CreateJobDto): Promise<JobInternal> {
    const now = new Date();
    const jobs = new JobInternal(
      {id: dto.nasabah_id},
      dto.perusahaan,
      dto.divisi,
      dto.golongan,
      dto.nama_atasan,
      dto.nama_hrd,
      dto.absensi,
      undefined,
      now,
      null,
      dto.yayasan,
      dto.lama_kerja_bulan,
      dto.lama_kerja_tahun,
      dto.bukti_absensi,
      now,
    );
    return this.repo.save(jobs);
  }

  async update(id: number, dto: UpdateJobDto): Promise<JobInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<JobInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<JobInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
