// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralByKedinasan_Non_MOU_ORM_Entity } from '../Infrastructure/Entities/collateral-kedinasan-non-mou.orm-entity';
import { CollateralByKedinasan_Non_MOU_RepositoryImpl } from '../Infrastructure/Repositories/collateral-kedinasan-non-mou-external.repository.impl';
import { COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY } from '../Domain/Repositories/collateral-kedinasan-non-mou-external.repository';
import { CollateralKedinasan_NonMOU_ExternalService } from '../Application/Services/collateral-kedinasan-non-mou-external.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollateralByKedinasan_Non_MOU_ORM_Entity]),
  ],
  providers: [
    CollateralKedinasan_NonMOU_ExternalService,
    {
      provide: COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY,
      useClass: CollateralByKedinasan_Non_MOU_RepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CollateralKedinasan_NonMOU_ExternalService,
    COLLATERAL_KEDINASAN_NON_MOU_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class CollateralByKedinasan_Non_MOU_External_Module {}
