// Presentation/Controllers/AdAR_GetAllClientLoanInstallmentInternal.controller.ts

import {
  Controller,
  Get,
  Query,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdAR_GetAllClientLoanInstallmentInternalUseCase } from '../Applications/AdAR_GetAllClientLoanInstallmentInternal.usecase';
import { GetAllClientLoanInstallmentInternalDto } from '../Applications/DTOS/AdAR_ClientInternal.dto';

@Controller('admin-ar')
export class AdAR_GetAllClientLoanInstallmentInternalController {
  constructor(
    private readonly useCase: AdAR_GetAllClientLoanInstallmentInternalUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Get('clients-loan-installment-internal')
  async getAllClientLoanInstallmentInternal(
    @Query() dto: GetAllClientLoanInstallmentInternalDto,
  ) {
    try {
      if (dto.searchByClientName && dto.searchByClientName.trim().length < 3) {
        throw new BadRequestException({
          success: false,
          message: 'Pencarian nama minimal 3 karakter untuk performa optimal',
          reference: 'SEARCH_CLIENT_NAME_MIN_LENGTH',
        });
      }

      return this.useCase.execute(dto); // ← pass companyName
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      console.error(
        '[AdAR_GetAllClientLoanInstallmentInternal] Controller error:',
        error,
      );
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
