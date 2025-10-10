import { PartialType } from '@nestjs/mapped-types';
import { CreateEmergencyContactExternalDto } from './create-emergency-contact.dto';

export class UpdateEmergencyContactExternalDto extends PartialType(
  CreateEmergencyContactExternalDto,
) {}
