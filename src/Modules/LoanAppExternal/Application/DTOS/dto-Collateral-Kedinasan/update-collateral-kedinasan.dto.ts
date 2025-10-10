import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanKedinasanDto } from './create-collateral-kedinasan.dto';

export class UpdatePengajuanKedinasanDto extends PartialType(
  CreatePengajuanKedinasanDto,
) {}
