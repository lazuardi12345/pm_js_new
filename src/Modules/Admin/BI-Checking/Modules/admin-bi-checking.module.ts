// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRecommendation_ORM_Entity } from '../Infrastructure/Entities/approval-recommendation.orm-entity';
// import { AddressInternalRepositoryImpl } from '../Infrastructure/Repositories/address-internal.repository.impl';
// import { ADDRESS_INTERNAL_REPOSITORY } from '../Domain/Repositories/address-internal.repository';
// import { AddressInternalService } from '../Application/Services/address-internal.service';
// import { GetAddressByNasabahIdUseCase } from '../Application/Services/GetAddressByNasabahId.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalRecommendation_ORM_Entity])],
  //   providers: [
  //     {
  //       provide: ADDRESS_INTERNAL_REPOSITORY,
  //       useClass: AddressInternalRepositoryImpl,
  //     },
  //     AddressInternalService,
  //     // GetAddressByNasabahIdUseCase,
  //   ],
  //   exports: [
  //     ADDRESS_INTERNAL_REPOSITORY,
  //     AddressInternalService,
  //     // GetAddressByNasabahIdUseCase,
  //   ],
})
export class AdminBICheckingModule {}
