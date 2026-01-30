import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { SVY_CreateSurveyReportUseCase } from '../../Applications/Services/SVY_CreateSurveyResult.usecase';
import { CreateSurveyReportsDto } from 'src/Modules/LoanAppExternal/Application/DTOS/dto-Survey-Reports/create-survey-reports.dto';
import { FileUploadAuthGuard } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/file-upload.decorator';

@UseGuards(FileUploadAuthGuard)
@Controller('svy/ext/survey-reports')
export class SVY_CreateSurveyReportController {
  constructor(
    private readonly surveyReportUseCase: SVY_CreateSurveyReportUseCase,
  ) {}

  @Post('add')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'foto_survey', maxCount: 10 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
    }),
  )
  async createSurveyReport(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body('payload') payloadRaw: string, // Terima sebagai string dulu
  ) {
    try {
      if (!payloadRaw) {
        throw new BadRequestException('Payload is required');
      }

      let payload: CreateSurveyReportsDto;
      try {
        payload =
          typeof payloadRaw === 'string' ? JSON.parse(payloadRaw) : payloadRaw;
      } catch (parseError) {
        throw new BadRequestException('Invalid JSON payload');
      }

      // 2. Validasi payload
      if (!payload.pengajuan_luar_id) {
        throw new BadRequestException('pengajuan_luar_id is required');
      }

      if (
        !payload.berjumpa_dengan ||
        !payload.hubungan_dengan_nasabah ||
        !payload.status_rumah ||
        !payload.hasil_cekling_1 ||
        !payload.hasil_cekling_2
      ) {
        throw new BadRequestException('Required fields are missing');
      }

      // 3. Validasi files (opsional, tergantung requirement)
      if (!files || !files.foto_survey || files.foto_survey.length === 0) {
        throw new BadRequestException('At least one survey photo is required');
      }

      console.log(files);

      // 4. Initialize survey_photos array jika belum ada
      if (!payload.survey_photos) {
        payload.survey_photos = [];
      }

      // 5. Panggil usecase
      const result = await this.surveyReportUseCase.execute(payload, files);

      return result;
    } catch (error) {
      console.error('Error creating survey report:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'An error occurred while creating survey report',
      );
    }
  }
}
