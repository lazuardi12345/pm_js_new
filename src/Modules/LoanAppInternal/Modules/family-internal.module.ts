// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyInternal_ORM_Entity } from '../Infrastructure/Entities/family-internal.orm-entity';
import { FamilyInternalRepositoryImpl } from '../Infrastructure/Repositories/family-internal.repository.impl';
import { FAMILY_INTERNAL_REPOSITORY } from '../Domain/Repositories/family-internal.repository';
import { FamilyInternalService } from '../Application/Services/family-internal.service';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyInternal_ORM_Entity])],
  providers: [
    {
      provide: FAMILY_INTERNAL_REPOSITORY,
      useClass: FamilyInternalRepositoryImpl,
    },
    FamilyInternalService,
  ],
  exports: [FAMILY_INTERNAL_REPOSITORY, FamilyInternalService],
})
export class FamilyInternalModule {}
