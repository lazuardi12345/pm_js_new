import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateFinancialDependentsDto {
  @IsNumber()
  nasabah_id: number;

  @IsOptional()
  @IsString()
  kondisi_tanggungan?: string;

  @IsOptional()
  @IsBoolean()
  validasi_tanggungan?: boolean;
}
