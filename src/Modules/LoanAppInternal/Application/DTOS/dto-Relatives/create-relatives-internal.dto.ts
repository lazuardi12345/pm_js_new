import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';
import { KerabatKerjaEnum } from 'src/Shared/Enums/Internal/Relative.enum';

export class CreateRelativeInternalDto {
  @IsNumber()
  @IsNotEmpty()
  nasabah_id: number;

  @IsEnum(KerabatKerjaEnum)
  kerabat_kerja: KerabatKerjaEnum;

  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('ID') // Optional: validasi format no HP Indonesia
  no_hp?: string;

  @IsOptional()
  @IsString()
  status_hubungan?: string;

  @IsOptional()
  @IsString()
  nama_perusahaan?: string;
}
