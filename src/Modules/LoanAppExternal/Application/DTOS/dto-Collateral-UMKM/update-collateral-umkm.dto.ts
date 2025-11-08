import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanUmkmDto } from './create-collateral-umkm.dto';

export class UpdatePengajuanUmkmDto extends PartialType(
  CreatePengajuanUmkmDto,
) {}
