import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

export class CreateApprovalExternalDto {
  @IsNumber()
  pengajuan_id: number;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsEnum(USERTYPE)
  role: USERTYPE;

  @IsOptional()
  @IsString()
  analisa?: string;

  @IsOptional()
  @IsNumber()
  nominal_persetujuan?: number;

  @IsOptional()
  @IsNumber()
  tenor_persetujuan?: number;

  @IsOptional()
  @IsEnum(ApprovalExternalStatus)
  status?: ApprovalExternalStatus;

  @IsOptional()
  @IsString()
  kesimpulan?: string;

  @IsOptional()
  @IsString()
  dokumen_pendukung?: string;

  @IsOptional()
  @IsBoolean()
  is_banding?: boolean;
}
