import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

export class ApprovalExternal {
  constructor(
    public readonly pengajuan: { id: number },
    public readonly user_id: number,
    public readonly role: USERTYPE,
    public readonly is_banding: boolean = false,
    public readonly id?: number,
    public readonly analisa?: string | null,
    public readonly nominal_persetujuan?: number,
    public readonly tenor_persetujuan?: number,
    public readonly status?: ApprovalExternalStatus,
    public readonly kesimpulan?: string,
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
