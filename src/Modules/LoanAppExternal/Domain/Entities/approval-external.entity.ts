import {
  ApprovalExternalRole,
  ApprovalExternalStatus,
} from 'src/Shared/Enums/External/Approval.enum';

export class ApprovalExternal {
  constructor(
    public readonly pengajuanId: number,
    public readonly userId: number,
    public readonly role: ApprovalExternalRole,
    public readonly isBanding: boolean = false,
    public readonly id?: number,
    public readonly analisa?: string,
    public readonly nominalPinjaman?: number,
    public readonly tenor?: number,
    public readonly status?: ApprovalExternalStatus,
    public readonly catatan?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {}

  public isApproved(): boolean {
    return this.status === ApprovalExternalStatus.APPROVED;
  }

  public isRejected(): boolean {
    return this.status === ApprovalExternalStatus.REJECTED;
  }

  public canEdit(): boolean {
    return this.status === undefined || this.status === null;
  }

  public isFinalDecision(): boolean {
    return (
      this.status === ApprovalExternalStatus.APPROVED ||
      this.status === ApprovalExternalStatus.REJECTED
    );
  }
}
