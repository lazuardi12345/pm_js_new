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
import { MKT_TriggerFinalLoanStatusUseCase } from '../../Applications/Services/MKT_TriggerFinalLoan.usecase';

@Controller('mkt/int/loan-apps')
export class MKT_TriggerFinalLoanStatusController {
  constructor(
    private readonly triggerAppeal: MKT_TriggerFinalLoanStatusUseCase,
  ) {}
  @Patch('final-status-loan/:id')
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
