import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { MKT_CreateLoanApplicationUseCase } from '../../Applications/Services/MKT_CreateLoanApplication.usecase';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Controller('mkt/int/loan-apps')
export class MKT_CreateLoanApplicationController {
  constructor(
    private readonly createLoanApplication: MKT_CreateLoanApplicationUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Post('create')
  async submitLoanApp(
    @CurrentUser('id') marketingId: number,
    @Body() dto: any,
  ) {
    try {
      if (!dto || !dto.payload) {
        throw new BadRequestException('Payload is required');
      }

      // Jika payload berupa string, parse dulu ke objek
      const payload = typeof dto.payload === 'string' ? JSON.parse(dto.payload) : dto.payload;

      // Pastikan documents_files ada
      if (!payload.documents_files) {
        throw new BadRequestException('documents_files is required');
      }

      // Daftar dokumen yang wajib ada URL-nya
      const requiredUrls = [
        'foto_ktp',
        'foto_kk',
        'foto_id_card_penjamin',
        'foto_ktp_penjamin',
        'foto_id_card',
        'bukti_absensi_file',
        'foto_rekening',
      ];

      // Validasi setiap URL wajib
      for (const key of requiredUrls) {
        const url = payload.documents_files[key];
        if (!url) {
          throw new BadRequestException(`Missing URL for document: ${key}`);
        }
        try {
          new URL(url);
        } catch {
          throw new BadRequestException(`Invalid URL format for document: ${key}`);
        }
      }

      // Kirim payload dan marketingId ke usecase
      return await this.createLoanApplication.execute(payload, marketingId);
    } catch (error) {
      console.error('Error occurred:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while processing your request');
    }
  }
}
