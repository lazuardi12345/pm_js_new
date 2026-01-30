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
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@UseGuards(JwtAuthGuard)
@Controller('adcont/ext')
export class AdCont_GetAllLoanDataExternalController {
  constructor(
    private readonly getNasabahListUseCase: AdCont_GetAllLoanDataExternalUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_KONTRAK)
  @Get('loan-apps-data')
  async getNasabahList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {
    try {
      // Validasi input
      if (page < 1) {
        throw new BadRequestException('Page must be greater than 0');
      }

      if (pageSize < 1 || pageSize > 100) {
        throw new BadRequestException('Page size must be between 1 and 100');
      }

      const result = await this.getNasabahListUseCase.execute(page, pageSize);

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
