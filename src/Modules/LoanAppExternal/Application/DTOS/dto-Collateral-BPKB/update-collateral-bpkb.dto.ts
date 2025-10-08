import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanBPKBDto } from './create-collateral-bpkb.dto';

export class UpdatePengajuanBPKBDto extends PartialType(
  CreatePengajuanBPKBDto,
) {}
