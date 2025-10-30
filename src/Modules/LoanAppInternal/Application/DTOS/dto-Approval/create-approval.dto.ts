import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApprovalInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/approval-internal.entity';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
export class CreateApprovalDto {
  @IsNotEmpty()
  @IsNumber()
  pengajuan_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsEnum(USERTYPE)
  role: USERTYPE;

  @IsOptional()
  @IsEnum(ApprovalInternalStatusEnum)
  status?: ApprovalInternalStatusEnum;

  @IsOptional()
  tenor_persetujuan?: number;

  @IsOptional()
  @IsEnum(ApprovalInternalStatusEnum)
  nominal_persetujuan?: number;

  @IsOptional()
  @IsBoolean()
  is_banding?: boolean;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsString()
  kesimpulan?: string;
}
