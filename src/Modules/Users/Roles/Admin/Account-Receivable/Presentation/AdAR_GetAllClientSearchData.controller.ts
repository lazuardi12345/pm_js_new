// Presentation/Controllers/AdAR_SearchClientLoanAgreement.controller.ts

import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { AdAR_GetAllClientSearchDataUseCase } from '../Applications/AdAr_GetAllClientSearchData.usecase';
import { AdAr_GetAllClientSearchDataDto } from '../Applications/DTOS/AdAr_GetAllClientSearchData.dto';

@Controller('admin-ar')
export class AdAR_GetAllClientSearchDataController {
  constructor(private readonly useCase: AdAR_GetAllClientSearchDataUseCase) {}

  @Roles(USERTYPE.ADMIN_PIUTANG)
  @Get('clients/search')
  async search(@Query() dto: AdAr_GetAllClientSearchDataDto) {
    try {
      if (!dto.nama && !dto.no_ktp && !dto.id_card) {
        throw new BadRequestException({
          success: false,
          message:
            'Minimal isi salah satu parameter pencarian: nama, no_ktp, atau id_card',
          reference: 'SEARCH_PARAM_REQUIRED',
        });
      }

      if (dto.nama && dto.nama.trim().length < 3) {
        throw new BadRequestException({
          success: false,
          message: 'Pencarian nama minimal 3 karakter',
          reference: 'SEARCH_NAMA_MIN_LENGTH',
        });
      }

      return this.useCase.execute(dto);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      console.error(
        '[AdAR_SearchClientLoanAgreement] Controller error:',
        error,
      );
      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
