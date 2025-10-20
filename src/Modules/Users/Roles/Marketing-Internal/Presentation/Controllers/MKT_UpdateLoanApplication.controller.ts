import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { MKT_UpdateLoanApplicationUseCase } from '../../Applications/Services/MKT_UpdateLoanApplication.usecase';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { CreateLoanApplicationDto } from '../../Applications/DTOS/MKT_CreateLoanApplication.dto';

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
  @Body('payload', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  dto: CreateLoanApplicationDto,
  @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
) {
  try {
    const clientId = Number(clientIdParam);
    if (isNaN(clientId)) {
      throw new BadRequestException('Invalid client ID');
    }

    const result = await this.updateLoanApplication.execute(dto, files, clientId, marketingId);
    return result;
  } catch (error) {
    console.error('Error in update controller:', error);
    if (error instanceof BadRequestException) throw error;
    throw new InternalServerErrorException('An error occurred while processing your request');
  }
}
}