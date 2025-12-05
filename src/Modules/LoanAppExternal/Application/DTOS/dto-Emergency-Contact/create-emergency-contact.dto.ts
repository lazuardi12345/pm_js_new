import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateEmergencyContactExternalDto {
  @IsNumber()
  nasabah_id: number;

  @IsString()
  @IsNotEmpty()
  nama_kontak_darurat: string;

  @IsString()
  @IsNotEmpty()
  hubungan_kontak_darurat: string;

  @IsString()
  @IsNotEmpty()
  no_hp_kontak_darurat: string;

  @IsOptional()
  @IsBoolean()
  validasi_kontak_darurat?: boolean;
}
