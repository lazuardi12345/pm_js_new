// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailInstallmentItemsExternal_ORM_Entity } from '../Infrastructure/Entities/detail-installment-items.orm-entity';
import { DetailInstallmentItemsExternalRepositoryImpl } from '../Infrastructure/Repositories/detail-installment-items-external.repository.impl';
import { DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY } from '../Domain/Repositories/detail-installment-items-external.repository';
import { DetailInstallmentItemsService } from '../Application/Services/detail-installment-items-external.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailInstallmentItemsExternal_ORM_Entity]),
  ],
  providers: [
    DetailInstallmentItemsService,
    {
      provide: DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY,
      useClass: DetailInstallmentItemsExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    DetailInstallmentItemsService,
    DETAIL_INSTALLMENT_ITEMS_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class DetailInstallmentItemsExternalModule {}
