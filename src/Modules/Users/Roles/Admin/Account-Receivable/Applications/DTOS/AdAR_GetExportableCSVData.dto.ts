// AdAR_GetExportableCSVData.dto.ts

import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export type ExportableFrequencyStatusFilter =
  | 'on_going'
  | 'closing_installment'
  | 'all';

export class AdAR_GetExportableCSVDataDto {
  @IsString()
  company_name: string;

  @IsIn(['on_going', 'closing_installment', 'all'])
  frequency_status: ExportableFrequencyStatusFilter;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page_size?: number;
}
