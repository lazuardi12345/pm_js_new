// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressExternal_ORM_Entity } from '../Infrastructure/Entities/address-external.orm-entity';
import { AddressExternalRepositoryImpl } from '../Infrastructure/Repositories/address-external.repository.impl';
import { ADDRESS_EXTERNAL_REPOSITORY } from '../Domain/Repositories/address-external.repository';
import { AddressExternalService } from '../Application/Services/address-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressExternal_ORM_Entity])],
  providers: [
    {
      provide: ADDRESS_EXTERNAL_REPOSITORY,
      useClass: AddressExternalRepositoryImpl,
    },
    AddressExternalService
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    ADDRESS_EXTERNAL_REPOSITORY,
    AddressExternalService
    // GetAddressByNasabahIdUseCase,
  ],
})
export class AddressExternalModule {}
