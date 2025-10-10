// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralInternal_ORM_Entity } from '../Infrastructure/Entities/collateral-internal.orm-entity';
import { CollateralInternalRepositoryImpl } from '../Infrastructure/Repositories/collateral-internal.repository.impl';
import { COLLATERAL_INTERNAL_REPOSITORY } from '../Domain/Repositories/collateral-internal.repository';
import { CollateralInternalService } from '../Application/Services/collateral-internal.service';
// import { GetAddressByNasabahIdUseCase } from '../Application/Services/GetAddressByNasabahId.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CollateralInternal_ORM_Entity])],
  providers: [
    {
      provide: COLLATERAL_INTERNAL_REPOSITORY,
      useClass: CollateralInternalRepositoryImpl,
    },
    CollateralInternalService,
  ],
  exports: [COLLATERAL_INTERNAL_REPOSITORY, CollateralInternalService],
})
export class CollateralInternalModule {}
