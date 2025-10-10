// Domain/Repositories/approval-internal.repository.ts
import { ApprovalInternal } from '../Entities/approval-internal.entity';

export const APPROVAL_INTERNAL_REPOSITORY = Symbol('APPROVAL_INTERNAL_REPOSITORY');

export interface IApprovalInternalRepository {
  findById(id: number): Promise<ApprovalInternal | null>;
  findByNasabahId(nasabahId: number): Promise<ApprovalInternal[]>;
  findAll(): Promise<ApprovalInternal[]>;
  save(approval: ApprovalInternal): Promise<ApprovalInternal>;
  update(
    id: number,
    approval: Partial<ApprovalInternal>,
  ): Promise<ApprovalInternal>;
  delete(id: number): Promise<void>;
}
