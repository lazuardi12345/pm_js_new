import { JobInternal } from '../Entities/job-internal.entity';

export const JOB_INTERNAL_REPOSITORY = Symbol('JOB_INTERNAL_REPOSITORY');

export interface IJobInternalRepository {
  findById(id: number): Promise<JobInternal | null>;
  findByNasabahId(nasabahId: number): Promise<JobInternal[]>;
  findAll(): Promise<JobInternal[]>;
  save(jobData: JobInternal): Promise<JobInternal>;
  update(
    id: number,
    jobData: Partial<JobInternal>,
  ): Promise<JobInternal>;
  delete(id: number): Promise<void>;
  // delete(id: number): Promise<void>;
}
