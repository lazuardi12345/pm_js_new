// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobExternal_ORM_Entity } from '../Infrastructure/Entities/job.orm-entity';
import { JobExternalRepositoryImpl } from '../Infrastructure/Repositories/job-external.repository.impl';
import { JOB_EXTERNAL_REPOSITORY } from '../Domain/Repositories/job-external.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobExternal_ORM_Entity])],
  providers: [
    {
      provide: JOB_EXTERNAL_REPOSITORY,
      useClass: JobExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    JOB_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class Jobs_External_Module {}
