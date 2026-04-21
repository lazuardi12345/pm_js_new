// Presentation/Controllers/AdAR_UpdateExpectedPayoutDate.controller.ts

import {
  Controller,
  Patch,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdAR_AddExpectedPayoutInLoanFrequencyUseCase } from '../Applications/AdAR_AddExpectedPayoutInLoanFrequency.usecase';
import { AdAR_AddExpectedLoanPayoutDateDto } from '../Applications/DTOS/AdAR_AddExpectedLoanPayoutDate.dto';

@Controller('admin-ar')
export class AdAR_AddExpectedPayoutInLoanFrequencyController {
  constructor(
    private readonly useCase: AdAR_AddExpectedPayoutInLoanFrequencyUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Patch('client-loan-installment-frequency/:frequency_id/expected-payout-date')
  async updateExpectedPayoutDate(
    @Param('frequency_id', new ParseUUIDPipe()) frequency_id: string,
    @Body() dto: AdAR_AddExpectedLoanPayoutDateDto,
  ) {
    try {
      if (!frequency_id) {
        throw new BadRequestException({
          success: false,
          message: 'frequency_id tidak boleh kosong',
          reference: 'FREQUENCY_ID_REQUIRED',
        });
      }

      return this.useCase.execute(frequency_id, dto);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      console.error('[AdAR_UpdateExpectedPayoutDate] Controller error:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
