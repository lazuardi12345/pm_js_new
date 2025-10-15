import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobExternal_ORM_Entity } from '../Infrastructure/Entities/job.orm-entity';
import { JobExternalRepositoryImpl } from '../Infrastructure/Repositories/job-external.repository.impl';
import { JOB_EXTERNAL_REPOSITORY } from '../Domain/Repositories/job-external.repository';
import { JobExternalService } from '../Application/Services/job-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobExternal_ORM_Entity])],
  providers: [
    JobExternalService, 
    {
      provide: JOB_EXTERNAL_REPOSITORY,
      useClass: JobExternalRepositoryImpl,
    },
  ],
  exports: [
    JobExternalService, 
    JOB_EXTERNAL_REPOSITORY,
  ],
})
export class Jobs_External_Module {}
