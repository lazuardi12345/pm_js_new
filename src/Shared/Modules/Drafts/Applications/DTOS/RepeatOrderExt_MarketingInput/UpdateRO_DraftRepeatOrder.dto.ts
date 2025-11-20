import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftRepeatOrderDto } from './CreateRO_DraftRepeatOrder.dto';

export class UpdateDraftRepearOrderDto extends PartialType(
  CreateDraftRepeatOrderDto,
) {
  // Tambahkan ini agar bisa terima langsung tanpa "payload"
  client_internal?: any;
  address_internal?: any;
  family_internal?: any;
  job_internal?: any;
  loan_application_internal?: any;
  collateral_internal?: any;
  relative_internal?: any;
}
