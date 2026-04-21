// AdAR_GetInstallmentDetail.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdAR_GetClientInstallmentDetailUseCase } from '../Applications/AdAR_GetClientInstallmentDetailByUUID.usecase';

@UseGuards(JwtAuthGuard)
@Controller('admin-ar')
export class AdAR_GetClientInstallmentDetailController {
  constructor(
    private readonly useCase: AdAR_GetClientInstallmentDetailUseCase,
  ) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Get('installment/:frequencyId/detail')
  async getInstallmentDetail(
    // Pipe ini otomatis memvalidasi UUID dan melempar BadRequestException jika salah
    @Param('frequencyId', new ParseUUIDPipe()) frequencyId: string,
    @Query('installmentId') installmentId: string = '',
  ) {
    try {
      return await this.useCase.execute(installmentId, frequencyId);
    } catch (error) {
      return {
        payload: {
          success: false,
          message: error.message || 'Gagal mengambil data cicilan',
          reference: 'INSTALLMENT_DETAIL_CONTROLLER_ERROR',
        },
      };
    }
  }
}
