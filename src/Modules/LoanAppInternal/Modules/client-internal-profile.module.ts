// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientInternalProfile_ORM_Entity } from '../Infrastructure/Entities/client-internal-profile.orm-entity';
import { ClientInternalProfileRepositoryImpl } from '../Infrastructure/Repositories/client-internal-profile.repository.impl';
import { CLIENT_INTERNAL_PROFILE_REPOSITORY } from '../Domain/Repositories/client-internal-profile.repository';
import { ClientInternalProfileService } from '../Application/Services/client-internal-profile.service';
// import { GetAddressByNasabahIdUseCase } from '../Application/Services/GetAddressByNasabahId.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ClientInternalProfile_ORM_Entity])],
  providers: [
    {
      provide: CLIENT_INTERNAL_PROFILE_REPOSITORY,
      useClass: ClientInternalProfileRepositoryImpl,
    },
    ClientInternalProfileService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CLIENT_INTERNAL_PROFILE_REPOSITORY,
    ClientInternalProfileService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class ClientInternalProfileModule {}
