// src/Modules/LoanAppExternal/Application/DTOS/dto-Survey-Reports/create-survey-reports.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSurveyReportsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  pengajuan_luar_id: number;

  @IsNotEmpty()
  @IsString()
  berjumpa_siapa: string;

  @IsNotEmpty()
  @IsString()
  hubungan: string;

  @IsNotEmpty()
  @IsString()
  status_rumah: string;

  @IsNotEmpty()
  @IsString()
  hasil_cekling1: string;

  @IsNotEmpty()
  @IsString()
  hasil_cekling2: string;

  @IsNotEmpty()
  @IsString()
  kesimpulan: string;

  @IsNotEmpty()
  @IsString()
  rekomendasi: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  survey_photos?: string[];
}
