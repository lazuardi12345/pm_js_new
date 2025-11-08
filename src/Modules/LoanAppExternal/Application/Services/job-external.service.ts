import { Injectable, Inject } from '@nestjs/common';
import {
  IJobExternalRepository,
  JOB_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/job-external.repository';
import { JobExternal } from '../../Domain/Entities/job-external.entity';
import { CreateJobExternalDto } from '../DTOS/dto-Job/create-job.dto';
import { UpdateJobExternalDto } from '../DTOS/dto-Job/update-job.dto';

@Injectable()
export class JobExternalService {
  constructor(
    @Inject(JOB_EXTERNAL_REPOSITORY)
    private readonly repo: IJobExternalRepository,
  ) {}
  

async create(dto: CreateJobExternalDto): Promise<JobExternal> {
  const now = new Date();

  const job = new JobExternal(
    { id: dto.nasabah_id },        
    dto.perusahaan,
    dto.alamat_perusahaan,
    dto.kontak_perusahaan,
    dto.jabatan,
    dto.lama_kerja,
    dto.status_karyawan,
    dto.pendapatan_perbulan,       
    dto.slip_gaji_peminjam,
    dto.slip_gaji_penjamin,
    dto.rekening_koran,          
    dto.id_card_peminjam,
    dto.id_card_penjamin,
    dto.lama_kontrak,
    dto.validasi_pekerjaan,
    dto.catatan,
    undefined,                    
    now,                            // created_at
    now,                            // updated_at
    null                            // deleted_at
  );

  return this.repo.save(job);
}


  async update(id: number, dto: UpdateJobExternalDto): Promise<JobExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<JobExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<JobExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
