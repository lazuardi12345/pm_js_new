// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralByKedinasan_ORM_Entity } from '../Infrastructure/Entities/collateral-kedinasan-mou.orm-entity';
import { CollateralByKedinasanMouRepositoryImpl } from '../Infrastructure/Repositories/collateral-kedinasan-mou-external.repository.impl';
import { COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY } from '../Domain/Repositories/collateral-kedinasan-mou-external.repository';
import { CollateralKedinasanMOUExternalService } from '../Application/Services/collateral-kedinasan-mou-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollateralByKedinasan_ORM_Entity])],
  providers: [
    CollateralKedinasanMOUExternalService,
    {
      provide: COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY,
      useClass: CollateralByKedinasanMouRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CollateralKedinasanMOUExternalService,
    COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class CollateralByKedinasan_External_Module {}
