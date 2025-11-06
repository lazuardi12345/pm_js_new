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
  IsNotEmpty,
} from 'class-validator';

import {
  CLIENT_TYPE,
  GENDER,
  MARRIAGE_STATUS,
} from 'src/Shared/Enums/Internal/Clients.enum';

export class CreateClientInternalProfileDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsString()
  nama_lengkap: string;

  @IsString()
  no_ktp: string;

  @IsEnum(GENDER)
  jenis_kelamin: GENDER;

  @IsEnum(CLIENT_TYPE)
  tipe_nasabah: CLIENT_TYPE;

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
}
