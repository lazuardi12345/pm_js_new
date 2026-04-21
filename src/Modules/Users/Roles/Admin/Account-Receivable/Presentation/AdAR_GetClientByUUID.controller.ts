// AdAR_GetClientLoanDetail.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdAR_GetClientDetailByUUIDUseCase } from '../Applications/AdAR_GetClientByUUID.usecase';

@UseGuards(JwtAuthGuard)
@Controller('admin-ar')
export class AdAR_GetClientDetailByUUID_Controller {
  constructor(private readonly useCase: AdAR_GetClientDetailByUUIDUseCase) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Get('client/:clientId/loan-detail')
  async getClientDetailByUUID(
    @Param('clientId', new ParseUUIDPipe()) clientId: string,
    @Query('loanFrequency') loanFrequency?: string,
  ) {
    try {
      const parsedFrequency = loanFrequency
        ? parseInt(loanFrequency, 10)
        : null;

      if (loanFrequency && (isNaN(parsedFrequency!) || parsedFrequency! < 1)) {
        throw new BadRequestException(
          'loanFrequency harus berupa angka positif',
        );
      }

      return this.useCase.execute(clientId, parsedFrequency);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      return {
        payload: {
          success: false,
          message: error.message || 'Gagal mengambil data loan detail',
          reference: 'CLIENT_LOAN_DETAIL_CONTROLLER_ERROR',
        },
      };
    }
  }
}
