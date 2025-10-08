import { PartialType } from '@nestjs/mapped-types';
import { CreateOtherExistLoansExternalDto } from './create-other-exist-loans.dto';

export class UpdateOtherExistLoansExternalDto extends PartialType(
  CreateOtherExistLoansExternalDto,
) {}
