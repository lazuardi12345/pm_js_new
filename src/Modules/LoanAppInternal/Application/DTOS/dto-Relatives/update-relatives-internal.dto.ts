import { PartialType } from '@nestjs/mapped-types';
import { CreateRelativeInternalDto } from './create-relatives-internal.dto';
export class UpdateRelativeInternalDto extends PartialType(
  CreateRelativeInternalDto,
) {}
