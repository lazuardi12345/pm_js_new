// Domain/Repositories/approval-external.repository.ts
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { ApprovalExternalNotificationRaw } from '../../Application/DTOS/dto-Approval/get-total-notification.dto';
import { ApprovalExternal } from '../Entities/approval-external.entity';

export const APPROVAL_EXTERNAL_REPOSITORY = 'APPROVAL_EXTERNAL_REPOSITORY';

export interface IApprovalExternalRepository {
  findById(id: number): Promise<ApprovalExternal | null>;
  findByNasabahId(nasabahId: number): Promise<ApprovalExternal[]>;
  findAll(): Promise<ApprovalExternal[]>;
  save(address: ApprovalExternal): Promise<ApprovalExternal>;
  update(
    id: number,
    address: Partial<ApprovalExternal>,
  ): Promise<ApprovalExternal>;
  delete(id: number): Promise<void>;

  totalApprovalRequestExternal(
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalExternalNotificationRaw>;
}
