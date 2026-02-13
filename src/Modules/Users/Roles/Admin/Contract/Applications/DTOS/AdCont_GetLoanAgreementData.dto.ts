// src/Modules/Admin/Contracts/Application/DTOs/get-all-loan-agreement.dto.ts
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  IsNumberString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllLoanAgreementDto {
  @ApiPropertyOptional({
    description: 'Search by contract number (exact match)',
    example: 'LA-2024-00001',
    maxLength: 15,
  })
  @IsOptional()
  @IsString()
  @Length(1, 15)
  searchByContractNumber?: string;

  @ApiPropertyOptional({
    description: 'Search by KTP number (exact match)',
    example: '3201234567890123',
  })
  @IsOptional()
  @IsNumberString()
  searchByResidentNumber?: string;

  @ApiPropertyOptional({
    description: 'Search by name using fulltext search (minimum 3 characters)',
    example: 'John Doe',
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'Pencarian nama minimal 3 karakter untuk performa optimal',
  })
  searchByName?: string;

  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page (max 100)',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100, {
    message: 'Maksimal 100 records per page',
  })
  pageSize?: number = 10;
}
