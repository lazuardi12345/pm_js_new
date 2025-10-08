import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialDependentsDto } from './create-financial-dependents.dto';

export class UpdateFinancialDependentsDto extends PartialType(
  CreateFinancialDependentsDto,
) {}
