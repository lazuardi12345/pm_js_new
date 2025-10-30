import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInternalProfileDto } from './create-client-internal-profile.dto';

export class UpdateClientInternalProfileDto extends PartialType(
  CreateClientInternalProfileDto,
) {}
