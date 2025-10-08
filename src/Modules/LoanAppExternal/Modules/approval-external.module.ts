// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalExternal_ORM_Entity } from '../Infrastructure/Entities/approval-external.orm-entity';
import { ApprovalExternalRepositoryImpl } from '../Infrastructure/Repositories/approval-external.repository.impl';
import { APPROVAL_EXTERNAL_REPOSITORY } from '../Domain/Repositories/approval-external.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalExternal_ORM_Entity])],
  providers: [
    {
      provide: APPROVAL_EXTERNAL_REPOSITORY,
      useClass: ApprovalExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    APPROVAL_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class ApprovalExternalModule {}
