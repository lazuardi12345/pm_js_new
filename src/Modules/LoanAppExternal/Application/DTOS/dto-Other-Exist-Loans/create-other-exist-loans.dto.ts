import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { CicilanItemDto } from './Create-cicilan-items.dto';

export class CreateOtherExistLoansExternalDto {
  @IsNumber()
  nasabah_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CicilanItemDto)
  cicilan: CicilanItemDto[];

  @IsOptional()
  @IsBoolean()
  validasi_pinjaman_lain?: boolean;

  @IsOptional()
  @IsString()
  catatan?: string;
}
