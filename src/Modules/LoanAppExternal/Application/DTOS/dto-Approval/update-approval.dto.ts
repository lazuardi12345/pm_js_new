import { PartialType } from '@nestjs/mapped-types';
import { CreateApprovalExternalDto } from './create-approval.dto';

export class UpdateApprovalExternalDto extends PartialType(
  CreateApprovalExternalDto,
) {}
