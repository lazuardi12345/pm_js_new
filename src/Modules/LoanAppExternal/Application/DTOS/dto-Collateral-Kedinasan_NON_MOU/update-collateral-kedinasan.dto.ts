import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanKedinasanNonMouDto } from './create-collateral-kedinasan.dto';

export class UpdatePengajuanKedinasanNonMouDto extends PartialType(
  CreatePengajuanKedinasanNonMouDto,
) {}
