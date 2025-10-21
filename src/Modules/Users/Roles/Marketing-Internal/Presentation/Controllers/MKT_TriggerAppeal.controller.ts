import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { MKT_TriggerAppealUseCase } from '../../Applications/Services/MKT_TriggerAppeal.usecase';

@Controller('mkt/int/loan-apps')
export class MKT_TriggerAppealController {
  constructor(private readonly triggerAppeal: MKT_TriggerAppealUseCase) {}
  @Patch('create-appeal/:id')
  async update(
    @Param('id') loanId: string,
    @Body('payload') rawPayload: string,
  ) {
    const fixTypeId = Number(loanId);

    try {
      const result = await this.triggerAppeal.execute(fixTypeId, rawPayload);
      return result.payload;
    } catch (error) {
      console.error('Error in update controller:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
