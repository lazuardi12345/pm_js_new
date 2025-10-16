// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContactExternal_ORM_Entity } from '../Infrastructure/Entities/emergency-contact.orm-entity';
import { EmergencyContactExternalRepositoryImpl } from '../Infrastructure/Repositories/emergency-contact-external.repository.impl';
import { EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY } from '../Domain/Repositories/emergency-contact-external.repository';
import { EmergencyContactExternalService } from '../Application/Services/emergency-contact-external.service';


@Module({
  imports: [TypeOrmModule.forFeature([EmergencyContactExternal_ORM_Entity])],
  providers: [
    EmergencyContactExternalService,
    {
      provide: EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
      useClass: EmergencyContactExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    EmergencyContactExternalService,
    EMERGENCY_CONTACTS_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class EmergencyContact_External_Module {}
