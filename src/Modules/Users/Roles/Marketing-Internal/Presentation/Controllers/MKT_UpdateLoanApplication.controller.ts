import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MKT_UpdateLoanApplicationUseCase } from '../../Applications/Services/MKT_UpdateLoanApplication.usecase';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('mkt/int/loan-apps')
export class MKT_UpdateLoanApplicationController {
  constructor(
    private readonly updateLoanApplication: MKT_UpdateLoanApplicationUseCase,
  ) {}

  @Patch('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto_ktp', maxCount: 1 },
      { name: 'foto_kk', maxCount: 1 },
      { name: 'foto_id_card_penjamin', maxCount: 1 },
      { name: 'foto_ktp_penjamin', maxCount: 1 },
      { name: 'foto_id_card', maxCount: 1 },
      { name: 'bukti_absensi', maxCount: 1 },
      { name: 'foto_rekening', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') clientIdParam: string,
    @CurrentUser('id') marketingId: number,
    @Body() dto: any,
    @UploadedFiles()
    files: {
      foto_ktp?: Express.Multer.File[];
      foto_kk?: Express.Multer.File[];
      foto_id_card_penjamin?: Express.Multer.File[];
      foto_ktp_penjamin?: Express.Multer.File[];
      foto_id_card?: Express.Multer.File[];
      bukti_absensi?: Express.Multer.File[];
      foto_rekening?: Express.Multer.File[];
    },
  ) {
    try {
      const clientId = Number(clientIdParam);
      if (isNaN(clientId)) {
        throw new BadRequestException('Invalid client ID');
      }

      if (!dto || typeof dto !== 'object') {
        throw new BadRequestException('Request body must be a valid object');
      }

      console.log('Request body (payload):', dto);
      console.log('Uploaded files:', files);
      console.log('Client ID (parsed):', clientId);

      const result = await this.updateLoanApplication.execute(dto, files, clientId);

      console.log('Update result:', result);

      return result;
    } catch (error) {
      console.log('Error occurred in controller:', error);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while processing your request',
        );
      }
    }
  }
}
