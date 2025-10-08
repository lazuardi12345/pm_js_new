// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherExistLoansExternal_ORM_Entity } from '../Infrastructure/Entities/other-exist-loans.orm-entity';
import { OtherExistLoansExternalRepositoryImpl } from '../Infrastructure/Repositories/other-exist-loans-external.repository.impl';
import { OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY } from '../Domain/Repositories/other-exist-loans-external.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OtherExistLoansExternal_ORM_Entity])],
  providers: [
    {
      provide: OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY,
      useClass: OtherExistLoansExternalRepositoryImpl,
    },
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    OTHER_EXIST_LOANS_EXTERNAL_REPOSITORY,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class OtherExistLoans_External_Module {}
