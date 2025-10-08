import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSurveyReportsDto {
  @IsNumber()
  @IsNotEmpty()
  pengajuan_luar_id: number; // <- wajib

  @IsString()
  @IsNotEmpty()
  berjumpa_siapa: string;

  @IsString()
  @IsNotEmpty()
  hubungan: string;

  @IsString()
  @IsNotEmpty()
  status_rumah: string;

  @IsString()
  @IsNotEmpty()
  hasil_cekling1: string;

  @IsString()
  @IsNotEmpty()
  hasil_cekling2: string;

  @IsString()
  @IsNotEmpty()
  kesimpulan: string;

  @IsString()
  @IsNotEmpty()
  rekomendasi: string;
}
