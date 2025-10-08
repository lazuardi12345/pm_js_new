import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import {
  StatusRumahEnum,
  DomisiliEnum,
} from 'src/Shared/Enums/Internal/Address.enum';

export class CreateAddressDto {
  @IsNumber()
  nasabah_id: number;

  @IsString()
  @IsNotEmpty()
  alamat_ktp: string;

  @IsString()
  @IsNotEmpty()
  rt_rw: string;

  @IsString()
  @IsNotEmpty()
  kelurahan: string;

  @IsString()
  @IsNotEmpty()
  kecamatan: string;

  @IsString()
  @IsNotEmpty()
  kota: string;

  @IsString()
  @IsNotEmpty()
  provinsi: string;

  @IsOptional()
  @IsEnum(StatusRumahEnum)
  status_rumah_ktp?: StatusRumahEnum;

  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsOptional()
  @IsString()
  alamat_lengkap?: string;
}
