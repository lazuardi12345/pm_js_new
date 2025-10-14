import {
  ApprovalExternalRole,
  ApprovalExternalStatus,
} from 'src/Shared/Enums/External/Approval.enum';

export class ApprovalExternal {
  constructor(
    public readonly pengajuan: {id: number},
    public readonly user_id: number,
    public readonly role: ApprovalExternalRole,
    public readonly is_banding: boolean = false,
    public readonly id?: number,
    public readonly analisa?: string,
    public readonly nominal_pinjaman?: number,
    public readonly tenor?: number,
    public readonly status?: ApprovalExternalStatus,
    public readonly catatan?: string,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
    public readonly deleted_at?: Date | null,
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
