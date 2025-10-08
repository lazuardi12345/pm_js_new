import { PartialType } from '@nestjs/mapped-types';
import { CreatePengajuanSHMDto } from './create-collateral-shm.dto';

export class UpdatePengajuanSHMDto extends PartialType(CreatePengajuanSHMDto) {}
