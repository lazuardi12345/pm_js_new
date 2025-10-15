import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsEmail,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';

import {
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';

export class CreateClientInternalDto {
  @IsNumber()
  marketing_id: number;

  @IsString()
  nama_lengkap: string;

  @IsString()
  no_ktp: string;

  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsString()
  tempat_lahir: string;

  @Type(() => Date)
  @IsDate()
  tanggal_lahir: Date;

  @IsString()
  no_hp: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(MARRIAGE_STATUS)
  status_nikah: MARRIAGE_STATUS;

  @IsOptional()
  @IsString()
  foto_ktp?: string;

  @IsOptional()
  @IsString()
  foto_kk?: string;

  @IsOptional()
  @IsString()
  foto_id_card?: string;

  @IsOptional()
  @IsString()
  foto_rekening?: string;

  @IsOptional()
  @IsString()
  no_rekening?: string;

  @IsBoolean()
  @IsOptional()
  enable_edit?: boolean;

  @IsOptional()
  @IsString()
  points?: string;
}
