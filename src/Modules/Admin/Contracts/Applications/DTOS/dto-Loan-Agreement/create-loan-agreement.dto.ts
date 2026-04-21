import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsEnum,
} from 'class-validator';
import { PayType } from 'src/Shared/Enums/Admins/Account-Receivable/PayType';
import { InternalCompanyList } from 'src/Shared/Enums/Admins/Contract/loan-agreement.enum';

export class CreateLoanAgreementDto {
  @IsString()
  @IsNotEmpty()
  nomor_kontrak: string;

  @IsOptional()
  @IsNumber()
  nomor_urut?: number;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsNumber()
  @IsNotEmpty()
  no_ktp: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  jenis_jaminan?: string;

  @IsOptional()
  @IsString()
  daerah?: string;

  @IsOptional()
  @IsString()
  tipe_pekerja?: string;

  @IsOptional()
  @IsString()
  sub_type?: string;

  @IsOptional()
  @IsString()
  potongan?: string;

  @IsOptional()
  @IsString()
  kelompok?: string;

  @IsOptional()
  @IsEnum(InternalCompanyList)
  perusahaan?: InternalCompanyList;

  @IsOptional()
  @IsString()
  inisial_marketing?: string;

  @IsOptional()
  @IsString()
  golongan?: string;

  @IsOptional()
  @IsString()
  inisial_ca?: string;

  @IsOptional()
  @IsString()
  id_card?: string;

  @IsOptional()
  @IsString()
  kedinasan?: string;

  @IsOptional()
  @IsNumber()
  pinjaman_ke?: number;

  @IsNumber()
  pokok_pinjaman: number;

  @IsNumber()
  tenor: number;

  @IsNumber()
  biaya_admin: number;

  @IsNumber()
  cicilan: number;

  @IsNumber()
  biaya_layanan: number;

  @IsNumber()
  bunga: number;

  @Transform(({ value }) => {
    if (typeof value === 'string' && value.includes('-')) {
      const [d, m, y] = value.split('-');
      return new Date(`${y}-${m}-${d}`);
    }
    return value;
  })
  @IsDate()
  tanggal_jatuh_tempo: Date;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsOptional()
  @IsEnum(PayType)
  pay_type?: PayType;
}
