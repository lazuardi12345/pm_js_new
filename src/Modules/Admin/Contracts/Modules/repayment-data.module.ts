// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepaymentData_ORM_Entity } from '../Infrastructure/Entities/repayment-data.orm-entity';
import { RepaymentDataRepositoryImpl } from '../Infrastructure/Repositories/repayment-data.repository.impl';
import { REPAYMENT_DATA_REPOSITORY } from '../Domain/Repositories/repayment-data.repository';
import { RepaymentDataService } from '../Applications/Services/repayment-data.service';
import { RepaymentDataController } from '../Presentation/Controllers/repayment-data.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RepaymentData_ORM_Entity])],
  controllers: [RepaymentDataController],
  providers: [
    {
      provide: REPAYMENT_DATA_REPOSITORY,
      useClass: RepaymentDataRepositoryImpl,
    },
    RepaymentDataService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    REPAYMENT_DATA_REPOSITORY,
    RepaymentDataService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class RepaymentDataModule {}
