import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralByUMKM_ORM_Entity } from '../Infrastructure/Entities/collateral-umkm.orm.entity';
import { CollateralUMKMRepositoryImpl } from '../Infrastructure/Repositories/collateral-umkm.repository.impl';
import { COLLATERAL_UMKM_REPOSITORY } from '../Domain/Repositories/collateral-umkm.repository';
import { CollateralUMKMService } from '../Application/Services/collateral-umkm.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollateralByUMKM_ORM_Entity])],
  providers: [
    CollateralUMKMService,
    {
      provide: COLLATERAL_UMKM_REPOSITORY,
      useClass: CollateralUMKMRepositoryImpl,
    },
  ],
  exports: [CollateralUMKMService, COLLATERAL_UMKM_REPOSITORY],
})
export class CollateralByUMKM_External_Module {}
