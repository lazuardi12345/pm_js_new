import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApprovalExternalRole, ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';

export class CreateApprovalExternalDto {
  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsEnum(ApprovalExternalRole)
  role: ApprovalExternalRole;

  @IsOptional()
  @IsString()
  analisa?: string;

  @IsOptional()
  @IsNumber()
  nominal_pinjaman?: number;

  @IsOptional()
  @IsNumber()
  tenor?: number;

  @IsOptional()
  @IsEnum(ApprovalExternalStatus)
  status?: ApprovalExternalStatus;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsBoolean()
  is_banding?: boolean;
}
