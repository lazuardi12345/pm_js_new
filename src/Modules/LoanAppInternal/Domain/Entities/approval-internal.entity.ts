// src/modules/LoanAppInternal/domain/entities/approval-internal.entity.ts
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';

export class ApprovalInternal {
  constructor(
    public readonly pengajuan: number, // Relationship to LoanApplicationInternal
    public readonly user: { id: number }, // Relationship to Users PIC (MKT, SPV, CA, HM)
    public readonly role: USERTYPE,
    public status: ApprovalInternalStatusEnum = ApprovalInternalStatusEnum.PENDING, // Default status
    public readonly tenorPersetujuan?: number,
    public readonly nominalPersetujuan?: number,
    public readonly isBanding: boolean = false,
    public readonly id?: number,
    public readonly keterangan?: string,
    public readonly kesimpulan?: string,
    public readonly dokumen_pendukung?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {}

  // Business Logic Method to check if approval is pending
  public isPending(): boolean {
    return this.status === ApprovalInternalStatusEnum.PENDING;
  }

  // Business Logic Method to approve or reject an approval
  public approve(): void {
    if (this.isPending()) {
      this.status = ApprovalInternalStatusEnum.APPROVED;
    } else {
      throw new Error('Approval is not in pending status.');
    }
  }

  // Business Logic Method to reject an approval
  public reject(): void {
    if (this.isPending()) {
      this.status = ApprovalInternalStatusEnum.REJECTED;
    } else {
      throw new Error('Approval is not in pending status.');
    }
  }
}
