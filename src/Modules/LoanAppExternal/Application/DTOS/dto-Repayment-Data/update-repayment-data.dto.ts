import { PartialType } from '@nestjs/mapped-types';
import { CreateDataCicilanDto } from './create-repayment-data.dto';

export class UpdateDataCicilanDto extends PartialType(CreateDataCicilanDto) {}
