// src/Modules/LoanAppExternal/Presentation/Controllers/SVY_GetNasabahListWithApproval_Controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdCont_GetAllLoanDataExternalUseCase } from '../Applications/Services/AdCont_GetLoanAppExternal.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('adcont/ext')
export class AdCont_GetAllLoanDataExternalController {
  constructor(
    private readonly getNasabahListUseCase: AdCont_GetAllLoanDataExternalUseCase,
  ) {}

  @Get('loan-apps-data')
  async getNasabahList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    try {
      // Validasi input
      if (page < 1) {
        throw new BadRequestException('Page must be greater than 0');
      }

      if (page_size < 1 || page_size > 100) {
        throw new BadRequestException('Page size must be between 1 and 100');
      }

      const result = await this.getNasabahListUseCase.execute(page, page_size);

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      return {
        payload: {
          success: false,
          message: error.message || 'Failed to get nasabah list',
          reference: 'NASABAH_LIST_CONTROLLER_ERROR',
        },
      };
    }
  }
}
