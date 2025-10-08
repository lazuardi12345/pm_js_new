import { PartialType } from '@nestjs/mapped-types';
import { CreateClientExternalDto } from './create-client-external.dto';

export class UpdateClientExternalDto extends PartialType(
  CreateClientExternalDto,
) {}
