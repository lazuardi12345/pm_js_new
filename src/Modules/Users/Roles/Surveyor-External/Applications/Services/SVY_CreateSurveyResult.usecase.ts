// src/Modules/LoanAppExternal/Application/UseCases/SVY_CreateSurveyReport_UseCase.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import { CreateSurveyReportsDto } from 'src/Modules/LoanAppExternal/Application/DTOS/dto-Survey-Reports/create-survey-reports.dto';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { SurveyReports } from 'src/Modules/LoanAppExternal/Domain/Entities/survey-reports-external.entity';
import { SurveyPhotos } from 'src/Modules/LoanAppExternal/Domain/Entities/survey-photos-external.entity';
import {
  FILE_STORAGE_SERVICE,
  FileMetadata,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import {
  CLIENT_EXTERNAL_REPOSITORY,
  IClientExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/client-external.repository';
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { now } from 'mongoose';

@Injectable()
export class SVY_CreateSurveyReportUseCase {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,
    @Inject(CLIENT_EXTERNAL_REPOSITORY)
    private readonly clientRepo: IClientExternalRepository,
  ) {}

  async execute(
    dto: CreateSurveyReportsDto,
    files?: Record<string, Express.Multer.File[]>,
  ) {
    try {
      return await this.uow.start(async () => {
        // 1. Validasi pengajuan exists
        const pengajuan = await this.loanAppRepo.findById(
          dto.pengajuan_luar_id,
        );
        if (!pengajuan) {
          throw new BadRequestException('Pengajuan not found');
        }

        // 2. Validasi client exists
        const client = await this.clientRepo.findById(pengajuan.nasabah.id);
        if (!client) {
          throw new BadRequestException('Client not found');
        }

        // 3. Cek apakah sudah ada survey report untuk pengajuan ini
        const existingReport =
          await this.uow.surveyReportsExternalRepo.findByPengajuanLuarId(
            dto.pengajuan_luar_id,
          );

        if (existingReport && existingReport.length > 0) {
          throw new BadRequestException(
            'Survey report already exists for this pengajuan',
          );
        }

        const timestamp = Date.now();

        const folderName = client.nama_lengkap
          ? `${timestamp}-${client.nama_lengkap}`
          : `survey-${Date.now()}`;

        // ───────────────────────────────────────────────────────────────
        // Bagian yang diperbaiki: Upload survey photos dengan nama unik
        let uploadedFiles: Record<string, FileMetadata[]> = {};
        if (files && Object.keys(files).length > 0) {
          uploadedFiles = await this.fileStorage.saveSurveyPhotos(
            client.nik.toString(),
            folderName,
            files,
          );

          // assign URL ke DTO
          for (const [fieldName, paths] of Object.entries(uploadedFiles)) {
            if (!paths || paths.length === 0) continue;

            const fieldToParentMap = {
              foto_survey: 'survey_photos',
            };

            const parentKey = fieldToParentMap[fieldName];
            if (!parentKey) continue;

            if (!dto[parentKey]) dto[parentKey] = [];

            for (const fileMeta of paths) {
              dto[parentKey].push(fileMeta.url);
            }
          }
        }
        // ───────────────────────────────────────────────────────────────

        // 4. Create Survey Report
        const surveyReportEntity = new SurveyReports(
          dto.pengajuan_luar_id,
          dto.berjumpa_dengan,
          dto.hubungan_dengan_nasabah,
          dto.status_rumah,
          dto.hasil_cekling_1,
          dto.hasil_cekling_2,
          dto.kesimpulan,
          dto.rekomendasi,
        );

        const surveyReport =
          await this.uow.surveyReportsExternalRepo.save(surveyReportEntity);
        if (!surveyReport.id) {
          throw new Error('Survey report ID tidak tersedia setelah save');
        }

        // 5. Save survey photos ke DB
        const createdPhotos: SurveyPhotos[] = [];
        if (dto.survey_photos && dto.survey_photos.length > 0) {
          for (const fotoUrl of dto.survey_photos) {
            const photoEntity = new SurveyPhotos(
              surveyReport.id!,
              undefined,
              parseFileUrl(fotoUrl),
            );
            const photo =
              await this.uow.surveyPhotosExternalRepo.save(photoEntity);
            createdPhotos.push(photo);
          }
        }

        await this.uow.loanAppExternalRepo.updateLoanAppExternalStatus(
          dto.pengajuan_luar_id,
          StatusPengajuanEnum.SURVEY_SELESAI,
        );

        return {
          payload: {
            success: true,
            message: 'Survey report created successfully',
            reference: 'SVY_CREATE_REPORT_OK',
            data: {
              survey_report_id: surveyReport.id,
              pengajuan_luar_id: dto.pengajuan_luar_id,
              total_photos: createdPhotos.length,
            },
          },
        };
      });
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      return {
        payload: {
          success: false,
          message: err.message || 'Failed to create survey report',
          reference: 'SVY_CREATE_REPORT_ERROR',
        },
      };
    }
  }
}

function parseFileUrl(
  input: string | Express.Multer.File | null | undefined,
): string | undefined {
  if (!input) return undefined;

  if (typeof input === 'string') {
    return input;
  }

  if ('path' in input) {
    return `http://your-server-url.com/${input.path}`;
  }

  return undefined;
}
