import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanKedinasanMOUDto } from './create-collateral-kedinasan.dto';

export class UpdatePengajuanKedinasanMOUDto extends PartialType(
  CreatePengajuanKedinasanMOUDto,
) {}
