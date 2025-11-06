import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { RecommendationEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';

export class CreateApprovalRecommendationDto {
  @IsEnum(RecommendationEnum)
  @IsNotEmpty()
  recommendation: RecommendationEnum;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsString()
  @IsOptional()
  draft_id?: string; // char(24) from Mongo

  @IsString()
  @IsOptional()
  nik?: string; // char(16) FOR NIK

  @IsString()
  @IsOptional()
  no_telp?: string; // char(14) FOR TELP

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nama_nasabah?: string;

  @IsNumber()
  @IsNotEmpty()
  nominal_pinjaman: number;

  @IsString()
  @IsOptional()
  catatan: string;

  @IsNumber()
  @IsOptional()
  loan_application_internal_id?: number;

  @IsNumber()
  @IsOptional()
  loan_application_external_id?: number;
}
