// Domain/Repositories/approval-external.repository.ts
import { JobExternal } from "../Entities/job-external.entity";

export const JOB_EXTERNAL_REPOSITORY = 'JOB_EXTERNAL_REPOSITORY';

export interface IJobExternalRepository {
  findById(id: number): Promise<JobExternal | null>;
  findByNasabahId(nasabahId: number): Promise<JobExternal[]>;
  findAll(): Promise<JobExternal[]>;
  save(address: JobExternal): Promise<JobExternal>;
  update(
    id: number,
    address: Partial<JobExternal>,
  ): Promise<JobExternal>;
  delete(id: number): Promise<void>;
}
