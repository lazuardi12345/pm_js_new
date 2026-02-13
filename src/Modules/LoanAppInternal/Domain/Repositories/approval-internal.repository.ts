// Domain/Repositories/approval-internal.repository.ts
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { ApprovalInternal } from '../Entities/approval-internal.entity';
import { ApprovalInternalNotificationRaw } from '../../Application/DTOS/dto-Address/get-total-notification.dto';

export const APPROVAL_INTERNAL_REPOSITORY = Symbol(
  'APPROVAL_INTERNAL_REPOSITORY',
);

export interface IApprovalInternalRepository {
  findByLoanIdAndUserId: any;
  findById(id: number): Promise<ApprovalInternal | null>;
  findByNasabahId(nasabahId: number): Promise<ApprovalInternal[]>;
  findAll(): Promise<ApprovalInternal[]>;
  save(approval: ApprovalInternal): Promise<ApprovalInternal>;
  update(
    id: number,
    approval: Partial<ApprovalInternal>,
  ): Promise<ApprovalInternal>;
  delete(id: number): Promise<void>;
  totalApprovalRequestInternal(
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalInternalNotificationRaw>;
}
