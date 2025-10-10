// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientExternal_ORM_Entity } from '../Infrastructure/Entities/client-external.orm-entity';
import { ClientExternalRepositoryImpl } from '../Infrastructure/Repositories/client-external.repository.impl';
import { CLIENT_EXTERNAL_REPOSITORY } from '../Domain/Repositories/client-external.repository';
import { ClientExternalService } from '../Application/Services/client-external.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientExternal_ORM_Entity])],
  providers: [
    {
      provide: CLIENT_EXTERNAL_REPOSITORY,
      useClass: ClientExternalRepositoryImpl,
    },
    ClientExternalService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CLIENT_EXTERNAL_REPOSITORY,
    ClientExternalService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class ClientExternalModule {}
