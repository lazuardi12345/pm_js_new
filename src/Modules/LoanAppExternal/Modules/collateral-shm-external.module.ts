// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralBySHM_ORM_Entity } from '../Infrastructure/Entities/collateral-shm.orm-entity';
import { CollateralBySHMRepositoryImpl } from '../Infrastructure/Repositories/collateral-shm-external.repository.impl';
import { COLLATERAL_SHM_EXTERNAL_REPOSITORY } from '../Domain/Repositories/collateral-shm-external.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CollateralBySHM_ORM_Entity])],
  providers: [
    {
      provide: COLLATERAL_SHM_EXTERNAL_REPOSITORY,
      useClass: CollateralBySHMRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    COLLATERAL_SHM_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class CollateralBySHM_External_Module {}
