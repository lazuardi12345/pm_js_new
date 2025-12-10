import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailInstallmentItemsDto } from './create-detail-installment-items.dto';

export class UpdateDetailInstallmentItemsDto extends PartialType(
  CreateDetailInstallmentItemsDto,
) {}
