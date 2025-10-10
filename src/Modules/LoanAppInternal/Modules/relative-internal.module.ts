// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelativeInternal_ORM_Entity } from '../Infrastructure/Entities/relative-internal.orm-entity';
import { RelativeInternalRepositoryImpl } from '../Infrastructure/Repositories/relative-internal.repository.impl';
import { RELATIVE_INTERNAL_REPOSITORY } from '../Domain/Repositories/relatives-internal.repository';
import { RelativeInternalService } from '../Application/Services/relative-internal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RelativeInternal_ORM_Entity])],
  providers: [
    {
      provide: RELATIVE_INTERNAL_REPOSITORY,
      useClass: RelativeInternalRepositoryImpl,
    },
    RelativeInternalService,
  ],
  exports: [RELATIVE_INTERNAL_REPOSITORY, RelativeInternalService],
})
export class RelativeInternalModule {}
