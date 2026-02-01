import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class AdCont_CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  nik: string;

  @IsString()
  @IsNotEmpty()
  kode_voucher: string;

  @IsDate()
  @IsNotEmpty()
  kadaluarsa: Date;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  saldo?: string;

  @IsOptional()
  @IsNumber()
  is_claim?: number;

  // Ini semua harus OPTIONAL karena tidak dikirim user
  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date | null;
}
