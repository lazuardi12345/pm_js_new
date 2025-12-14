import {
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { VoucherType } from 'src/Shared/Enums/Admins/Contract/voucher.enum';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  nik: string;

  @IsString()
  @IsNotEmpty()
  kode_voucher: string;

  @IsDateString()
  @IsNotEmpty()
  kadaluarsa: Date;

  @IsEnum(VoucherType)
  @IsOptional()
  type?: VoucherType;

  @IsString()
  @IsOptional()
  saldo?: string;

  @IsNumber()
  @IsOptional()
  is_claim?: number; // default 0 (di DB)
}
