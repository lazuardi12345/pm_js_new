// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralByBPKB_ORM_Entity } from '../Infrastructure/Entities/collateral-bpkb.orm-entity';
import { CollateralByBPKBRepositoryImpl } from '../Infrastructure/Repositories/collateral-bpkb-external.repository.impl';
import { COLLATERAL_BPKB_EXTERNAL_REPOSITORY } from '../Domain/Repositories/collateral-bpkb-external.repository';
import { CollateralBpkbExternalService } from '../Application/Services/collateral-bpkb-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollateralByBPKB_ORM_Entity])],
  providers: [
    CollateralBpkbExternalService,
    {
      provide: COLLATERAL_BPKB_EXTERNAL_REPOSITORY,
      useClass: CollateralByBPKBRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CollateralBpkbExternalService,
    COLLATERAL_BPKB_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class CollateralByBPKB_External_Module {}
