import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AdCont_GetAllLoanAgreementsUseCase } from '../Applications/Services/AdCont_GetAllLoanAgreement.usecase';
import { GetAllLoanAgreementDto } from '../Applications/DTOS/AdCont_GetLoanAgreementData.dto';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@UseGuards(JwtAuthGuard)
@Controller('adcont')
export class AdCont_getAllLoanAgreementController {
  constructor(
    private readonly getAllLoanAgreementUseCase: AdCont_GetAllLoanAgreementsUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_KONTRAK)
  @Get('all-loan-agreements')
  async getAllLoanAgreements(@Query() query: GetAllLoanAgreementDto) {
    try {
      // Validation sudah di DTO, tapi double check buat keamanan
      if (query.page && query.page < 1) {
        throw new BadRequestException('Page must be greater than 0');
      }

      if (query.pageSize && (query.pageSize < 1 || query.pageSize > 100)) {
        throw new BadRequestException('Page size must be between 1 and 100');
      }

      if (query.searchByName && query.searchByName.trim().length < 3) {
        throw new BadRequestException(
          'Pencarian nama minimal 3 karakter untuk performa optimal',
        );
      }

      const result = await this.getAllLoanAgreementUseCase.execute(query);

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      return {
        payload: {
          success: false,
          message: error.message || 'Failed to get loan agreements',
          reference: 'LOAN_AGREEMENT_CONTROLLER_ERROR',
        },
      };
    }
  }
}
