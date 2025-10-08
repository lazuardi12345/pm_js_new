import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException, // Import BadRequestException untuk melemparkan error
  InternalServerErrorException,
  UseGuards, // Import InternalServerErrorException
} from '@nestjs/common';
import { MKT_CreateLoanApplicationUseCase } from '../../Applications/Services/MKT_CreateLoanApplication.usecase';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Public } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/public.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/jwtAuth.guard';
import { RolesGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Guards/roles.guard';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Controller('mkt/int/loan-apps')
export class MKT_CreateLoanApplicationController {
  constructor(
    private readonly createLoanApplication: MKT_CreateLoanApplicationUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USERTYPE.MARKETING)
  @Post('create')
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
  async create(
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
    console.log('Request body:', dto);
    console.log('Uploaded files:', files);

    try {
      if (!Object.values(files).some((arr) => arr && arr.length > 0)) {
        throw new BadRequestException('No files uploaded');
      }

      // parse payload kalau masih string
      const payload =
        typeof dto.payload === 'string' ? JSON.parse(dto.payload) : dto.payload;

      return await this.createLoanApplication.execute(
        payload,
        files,
        marketingId,
      );
    } catch (error) {
      console.log('Error occurred:', error);

      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid request data or files');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while processing your request',
        );
      }
    }
  }
}
