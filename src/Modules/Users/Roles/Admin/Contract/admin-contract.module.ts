// src/use-case/Marketing-Internal/marketing-internal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entitas
import { VouchersModule } from 'src/Modules/Admin/Contracts/Modules/vouchers.module';

//? USE CASE
import { AdCont_CreateVoucherUseCase } from './Applications/Services/AdCont_CreateVoucher.usecase';
//? CONTROLLER;
import { AdCont_CreateVouchersController } from './Presentation/AdCont_CreateVoucher.controller';

@Module({
  imports: [VouchersModule, TypeOrmModule.forFeature([VouchersModule])],
  controllers: [AdCont_CreateVouchersController],
  providers: [AdCont_CreateVoucherUseCase],
})
export class AdminContractUseCaseModule {}
