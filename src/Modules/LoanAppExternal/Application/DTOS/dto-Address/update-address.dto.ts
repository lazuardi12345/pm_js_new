import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressExternalDto } from './create-address.dto';

export class UpdateAddressExternalDto extends PartialType(
  CreateAddressExternalDto,
) {}
