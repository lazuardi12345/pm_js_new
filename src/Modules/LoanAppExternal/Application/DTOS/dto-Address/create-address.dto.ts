import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import {
  DomisiliEnum,
  RumahDomisiliEnum,
  StatusRumahEnum,
} from 'src/Shared/Enums/External/Address.enum';

export class CreateAddressExternalDto {
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

  @IsEnum(StatusRumahEnum)
  status_rumah: StatusRumahEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun?: number;

  @IsEnum(DomisiliEnum)
  domisili: DomisiliEnum;

  @IsOptional()
  @IsString()
  alamat_domisili?: string;

  @IsEnum(RumahDomisiliEnum)
  rumah_domisili: RumahDomisiliEnum;

  @IsOptional()
  @IsNumber()
  biaya_perbulan_domisili?: number;

  @IsOptional()
  @IsNumber()
  biaya_pertahun_domisili?: number;

  @IsOptional()
  @IsString()
  lama_tinggal?: string;

  @IsString()
  @IsNotEmpty()
  atas_nama_listrik: string;

  @IsString()
  @IsNotEmpty()
  hubungan: string;

  @IsOptional()
  @IsString()
  foto_meteran_listrik?: string;

  @IsNotEmpty()
  @IsString()
  share_loc_domisili?: string;

  @IsOptional()
  @IsString()
  share_loc_usaha?: string;

  @IsOptional()
  @IsString()
  share_loc_tempat_kerja?: string;

  @IsOptional()
  @IsBoolean()
  validasi_alamat?: boolean;
}
