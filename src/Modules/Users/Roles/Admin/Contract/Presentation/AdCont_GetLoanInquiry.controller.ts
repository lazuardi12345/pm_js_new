// src/Modules/LoanAppExternal/Infrastructure/Controllers/AdCont_GetLoanInquiry.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AdCont_GetLoanInquiryUseCase } from '../Applications/Services/AdCont_GetLoanInquiry.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@UseGuards(JwtAuthGuard)
@Controller('adcont')
export class AdCont_GetLoanInquiryController {
  constructor(
    private readonly getLoanInquiryUseCase: AdCont_GetLoanInquiryUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_KONTRAK)
  @Get('loan-inquiry')
  async getLoanInquiry(@Query('nik') nik: string) {
    try {
      // Validasi NIK
      if (!nik || nik.trim() === '') {
        throw new BadRequestException('NIK is required');
      }

      if (!/^\d{16}$/.test(nik.trim())) {
        throw new BadRequestException('NIK must be exactly 16 digits');
      }

      const result = await this.getLoanInquiryUseCase.execute(nik.trim());

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      return {
        payload: {
          success: false,
          message: error.message || 'Failed to get loan inquiry',
          reference: 'LOAN_INQUIRY_CONTROLLER_ERROR',
        },
      };
    }
  }
}
