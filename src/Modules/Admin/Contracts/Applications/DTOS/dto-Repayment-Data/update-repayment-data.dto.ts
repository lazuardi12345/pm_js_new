import { PartialType } from '@nestjs/mapped-types';
import { CreateRepaymentDataDto } from './create-repayment-data.dto';

export class UpdateRepaymentDataDto extends PartialType(
  CreateRepaymentDataDto,
) {}
