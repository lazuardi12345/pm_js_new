// src/Modules/LoanAppExternal/Presentation/Controllers/AdCont_GetLoanByIdExternal_Controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AdCont_GetLoanDetailByIdExternalUseCase } from '../Applications/Services/AdCont_GetLoanDetailByIdExternal.usecase';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@UseGuards(JwtAuthGuard)
@Controller('adcont/ext')
export class AdCont_GetLoanDetailByIdExternalController {
  constructor(
    private readonly getLoanByIdUseCase: AdCont_GetLoanDetailByIdExternalUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_KONTRAK)
  @Get('loan-apps-data/:id')
  async getLoanById(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id < 1) {
        throw new BadRequestException('Loan ID must be greater than 0');
      }

      const result = await this.getLoanByIdUseCase.execute(id);

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      return {
        error: true,
        message: error.message || 'Failed to get loan application detail',
        reference: 'LOAN_DETAIL_CONTROLLER_ERROR',
      };
    }
  }
}
