import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanBPJSDto } from './create-collateral-bpjs.dto';

export class UpdatePengajuanBPJSDto extends PartialType(
  CreatePengajuanBPJSDto,
) {}
