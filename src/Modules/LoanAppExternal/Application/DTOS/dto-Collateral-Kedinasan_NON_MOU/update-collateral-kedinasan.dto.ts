import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanKedinasan_Non_MOU_Dto } from './create-collateral-kedinasan.dto';

export class UpdatePengajuanKedinasan_Non_MOU_Dto extends PartialType(
  CreatePengajuanKedinasan_Non_MOU_Dto,
) {}
