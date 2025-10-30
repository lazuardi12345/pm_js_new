import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInternalDto } from './create-client-internal.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from '../dto-Address/update-address.dto';
import { UpdateFamilyDto } from '../dto-Family/update-family-internal.dto';
import { UpdateJobDto } from '../dto-Job/update-job-internal.dto';
import { UpdateLoanAplicationInternalDto } from '../dto-LoanApp/update-loan-application.dto';
import { UpdateRelativeInternalDto } from '../dto-Relatives/update-relatives-internal.dto';
import { UpdateCollateralDto } from '../dto-Collateral/update-collateral-internal.dto';

export class UpdateClientInternalDto extends PartialType(
  CreateClientInternalDto,
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLoanAplicationInternalDto)
  loanApplication?: UpdateLoanAplicationInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFamilyDto)
  family?: UpdateFamilyDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRelativeInternalDto)
  relative?: UpdateRelativeInternalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateJobDto)
  job?: UpdateJobDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCollateralDto)
  collateral?: UpdateCollateralDto;
}
