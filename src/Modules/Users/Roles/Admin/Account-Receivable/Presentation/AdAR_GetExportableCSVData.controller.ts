import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdAR_GetExportableCSVDataUseCase } from '../Applications/AdAR_GetExportableCSVData.usecase';
import { AdAR_GetExportableCSVDataDto } from '../Applications/DTOS/AdAR_GetExportableCSVData.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin-ar')
export class AdAR_GetExportableCSVDataController {
  constructor(private readonly useCase: AdAR_GetExportableCSVDataUseCase) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Get('exportable-csv')
  async getExportableCSVData(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: AdAR_GetExportableCSVDataDto,
  ) {
    try {
      return await this.useCase.execute(query);
    } catch (error) {
      return {
        payload: {
          success: false,
          message: error.message || 'Gagal mengambil data exportable CSV',
          reference: 'EXPORTABLE_CSV_DATA_CONTROLLER_ERROR',
        },
      };
    }
  }
}
