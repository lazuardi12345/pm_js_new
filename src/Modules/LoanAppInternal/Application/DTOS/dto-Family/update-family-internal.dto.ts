import { PartialType } from '@nestjs/mapped-types';
import { CreateFamilyDto } from './create-family-internal.dto';

export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {}
