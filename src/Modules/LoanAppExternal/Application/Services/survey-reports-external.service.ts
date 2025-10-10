import { Injectable, Inject } from '@nestjs/common';
import {
  ISurveyReportsRepository,
  SURVEY_REPORTS_EXTERNAL_REPOSITORY,
} from '../../Domain/Repositories/survey-reports-external.repository';
import { SurveyReports } from '../../Domain/Entities/survey-reports-external.entity';
import { CreateSurveyReportsDto } from '../DTOS/dto-Survey-Reports/create-survey-reports.dto';
import { UpdateSurveyReportsDto } from '../DTOS/dto-Survey-Reports/update-survey-reports.dto';
export class EmergencyContactExternalService {
  constructor(
    @Inject(SURVEY_REPORTS_EXTERNAL_REPOSITORY)
    private readonly repo: ISurveyReportsRepository,
  ) {}

  async create(dto: CreateSurveyReportsDto): Promise<SurveyReports> {
    const now = new Date();

    const address = new SurveyReports(
    dto.pengajuan_luar_id,                // pengajuanLuarId
    dto.berjumpa_siapa,                  // berjumpaSiapa
    dto.hubungan,                       // hubungan
    dto.status_rumah,                    // statusRumah
    dto.hasil_cekling1,                  // hasilCekling1
    dto.hasil_cekling2,                  // hasilCekling2
    dto.kesimpulan,                     // kesimpulan
    dto.rekomendasi,                    // rekomendasi                   // fotoSurveys (array of SurveyPhotos)
    undefined,                     // id (optional, null if not provided)
    now,                                // createdAt
    now,                                 // updatedAt
    undefined
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateSurveyReportsDto): Promise<SurveyReports> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<SurveyReports | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<SurveyReports[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
