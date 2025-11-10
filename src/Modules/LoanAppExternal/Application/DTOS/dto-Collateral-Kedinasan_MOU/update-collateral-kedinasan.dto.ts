import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanKedinasan_MOU_Dto } from './create-collateral-kedinasan.dto';

export class UpdatePengajuanKedinasan_MOU_Dto extends PartialType(
  CreatePengajuanKedinasan_MOU_Dto,
) {}
