import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class GetAllClientLoanInstallmentInternalDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Pencarian nama minimal 3 karakter' })
  searchByClientName?: string;

  @IsOptional()
  @IsString()
  companyName?: string; // ← tambah ini

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;
}
