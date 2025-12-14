// Modules/address-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vouchers_ORM_Entity } from '../Infrastructure/Entities/vouchers.orm-entity';
import { VouchersRepositoryImpl } from '../Infrastructure/Repositories/vouchers.repository.impl';
import { VOUCHER_REPOSITORY } from '../Domain/Repositories/vouchers.repository';
import { VouchersService } from '../Applications/Services/vouchers.service';
import { VouchersController } from '../Presentation/Controllers/vouchers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vouchers_ORM_Entity])],
  controllers: [VouchersController],
  providers: [
    {
      provide: VOUCHER_REPOSITORY,
      useClass: VouchersRepositoryImpl,
    },
    VouchersService,
    // GetAddressByNasabahIdUseCase,
  ],
  exports: [
    VOUCHER_REPOSITORY,
    VouchersService,
    // GetAddressByNasabahIdUseCase,
  ],
})
export class VouchersModule {}
