import { PartialType } from '@nestjs/mapped-types';
import { CreateClientExternalProfileDto } from './create-client-external-profile.dto';

export class UpdateClientExternalProfileDto extends PartialType(
  CreateClientExternalProfileDto,
) {}
