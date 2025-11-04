import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
  Param,
  UploadedFiles,
} from '@nestjs/common';

import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CreateLoanApplicationDto } from '../../Applications/DTOS/MKT_CreateLoanApplication.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { MKT_CreateRepeatOrderUseCase } from '../../Applications/Services/MKT_CreateRepeatOrder.usecase';

@Controller('mkt/int/loan-apps')
export class MKT_CreateRepeatOrderController {
  constructor(
    private readonly createRepeatOrder: MKT_CreateRepeatOrderUseCase,
  ) {}

  @Post('create/repeat-order/:client_id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'foto_ktp', maxCount: 1 },
        { name: 'foto_kk', maxCount: 1 },
        { name: 'bukti_absensi', maxCount: 1 },
        { name: 'foto_id_card_penjamin', maxCount: 1 },
        { name: 'foto_ktp_penjamin', maxCount: 1 },
        { name: 'foto_rekening', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  async submitRepeatOrder(
    @Param('client_id') client_id: number,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() body: any, // Terima apa saja dulu
  ) {
    try {
      const dto =
        typeof body.payload === 'string'
          ? JSON.parse(body.payload)
          : body.payload;

      const validatedDto = await new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }).transform(dto, { type: 'body', metatype: CreateLoanApplicationDto });

      return await this.createRepeatOrder.execute(
        validatedDto,
        client_id,
        files,
      );
    } catch (error) {
      console.error('Error occurred:', error);
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while processing your request',
      );
    }
  }
}
