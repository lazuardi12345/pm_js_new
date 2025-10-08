import { PartialType } from '@nestjs/mapped-types';
import { CreateCollateralDto } from './create-collateral-internal.dto';

export class UpdateCollateralDto extends PartialType(CreateCollateralDto) {}
