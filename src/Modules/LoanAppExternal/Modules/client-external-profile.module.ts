// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientExternalProfile_ORM_Entity } from '../Infrastructure/Entities/client-external-profile.orm-entity';
import { ClientExternalProfileRepositoryImpl } from '../Infrastructure/Repositories/client-external-profile.repository.impl';
import { CLIENT_EXTERNAL_PROFILE_REPOSITORY } from '../Domain/Repositories/client-external-profile.repository';
import { ClientExternalProfileService } from '../Application/Services/client-external-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientExternalProfile_ORM_Entity])],
  providers: [
    {
      provide: CLIENT_EXTERNAL_PROFILE_REPOSITORY,
      useClass: ClientExternalProfileRepositoryImpl,
    },
    ClientExternalProfileService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    CLIENT_EXTERNAL_PROFILE_REPOSITORY,
    ClientExternalProfileService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class ClientExternalProfileModule {}
