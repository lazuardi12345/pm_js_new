// src/modules/LoanAppInternal/domain/services/approval-Validation.service.ts
import { ApprovalInternal } from '../Entities/approval-internal.entity';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

export class ApprovalValidationService {
  private static readonly approvalOrder: USERTYPE[] = [
    USERTYPE.MARKETING,
    USERTYPE.SPV,
    USERTYPE.CA,
    USERTYPE.HM,
  ];

  /**
   * Cek apakah approval bisa dilakukan oleh role tertentu
   */
  static canApprove(
    approvals: ApprovalInternal[],
    role: USERTYPE,
  ): boolean {
    const lastApproval = approvals[approvals.length - 1];

    // Kalau belum ada approval → harus dimulai dari role pertama
    if (!lastApproval) {
      return role === this.approvalOrder[0];
    }

    // Kalau terakhir belum selesai → gak boleh approve
    if (lastApproval.isPending()) {
      return false;
    }

    // Ambil role selanjutnya
    const nextRoleIndex = this.approvalOrder.indexOf(lastApproval.role) + 1;
    return this.approvalOrder[nextRoleIndex] === role;
  }

  /**
   * Cek apakah semua approval selesai (disetujui / ditolak)
   */
  static isProcessComplete(approvals: ApprovalInternal[]): boolean {
    return approvals.some(
      (a) => a.status === ApprovalInternalStatusEnum.REJECTED,
    ) || approvals.length === this.approvalOrder.length;
  }
}
