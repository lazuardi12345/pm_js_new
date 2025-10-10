// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientInternal_ORM_Entity } from '../Infrastructure/Entities/client-internal.orm-entity';
import { ClientInternalRepositoryImpl } from '../Infrastructure/Repositories/client-internal.repository.impl';
import { CLIENT_INTERNAL_REPOSITORY } from '../Domain/Repositories/client-internal.repository';
import { ClientInternalService } from '../Application/Services/client-internal.service';
// import { GetAddressByNasabahIdUseCase } from '../Application/Services/GetAddressByNasabahId.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ClientInternal_ORM_Entity])],
  providers: [
    {
      provide: CLIENT_INTERNAL_REPOSITORY,
      useClass: ClientInternalRepositoryImpl,
    },
    ClientInternalService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CLIENT_INTERNAL_REPOSITORY,
    ClientInternalService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class ClientInternalModule {}
