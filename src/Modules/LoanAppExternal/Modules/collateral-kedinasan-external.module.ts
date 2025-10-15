// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralByKedinasan_ORM_Entity } from '../Infrastructure/Entities/collateral-kedinasan.orm-entity';
import { CollateralByKedinasanRepositoryImpl } from '../Infrastructure/Repositories/collateral-kedinasan-external.repository.impl';
import { COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY } from '../Domain/Repositories/collateral-kedinasan-external.repository';
import { CollateralKedinasanExternalService } from '../Application/Services/collateral-kedinasan-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollateralByKedinasan_ORM_Entity])],
  providers: [
    CollateralKedinasanExternalService,
    {
      provide: COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY,
      useClass: CollateralByKedinasanRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CollateralKedinasanExternalService,
    COLLATERAL_KEDINASAN_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class CollateralByKedinasan_External_Module {}
