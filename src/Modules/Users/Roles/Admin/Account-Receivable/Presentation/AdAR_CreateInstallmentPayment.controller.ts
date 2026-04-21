// AdAR_CreateInstallmentPayment.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AdAR_CreateInstallmentPaymentUseCase } from '../Applications/AdAR_CreateInstallmentPayment.usecase';
import { AdAR_CreateInstallmentPaymentDto } from '../Applications/DTOS/AdAR_CreateInstallmentPayment.dto';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@UseGuards(JwtAuthGuard)
@Controller('admin-ar')
export class AdAR_CreateInstallmentPaymentController {
  constructor(private readonly useCase: AdAR_CreateInstallmentPaymentUseCase) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Post('installment/pay')
  async createPayment(@Body() dto: AdAR_CreateInstallmentPaymentDto) {
    try {
      return this.useCase.execute(dto);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      return {
        payload: {
          success: false,
          message: error.message || 'Gagal menyimpan pembayaran',
          reference: 'INSTALLMENT_PAYMENT_CONTROLLER_ERROR',
        },
      };
    }
  }
}
