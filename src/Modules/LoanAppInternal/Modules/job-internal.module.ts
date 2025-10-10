// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobInternal_ORM_Entity } from '../Infrastructure/Entities/job-internal.orm-entity';
import { JobInternalRepositoryImpl } from '../Infrastructure/Repositories/job-internal.repository.impl';
import { JOB_INTERNAL_REPOSITORY } from '../Domain/Repositories/job-internal.repository';
import { JobInternalService } from '../Application/Services/job-internal.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobInternal_ORM_Entity])],
  providers: [
    {
      provide: JOB_INTERNAL_REPOSITORY,
      useClass: JobInternalRepositoryImpl,
    },
    JobInternalService,
  ],
  exports: [JOB_INTERNAL_REPOSITORY, JobInternalService],
})
export class JobInternalModule {}
