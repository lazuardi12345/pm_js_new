import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ApprovalInternal } from 'src/Modules/LoanAppInternal/Domain/Entities/approval-internal.entity';
import {
  IApprovalInternalRepository,
  APPROVAL_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/approval-internal.repository';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from 'src/Modules/Users/Domain/Repositories/users.repository';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';

@Injectable()
export class CA_ApproveOrRejectUseCase {
  constructor(
    @Inject(APPROVAL_INTERNAL_REPOSITORY)
    private readonly approvalRepo: IApprovalInternalRepository,
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(USERS_REPOSITORY)
    private readonly userRepo: IUsersRepository,
  ) {}

  async execute(
    loan_id: number,
    user_id: number,
    role: USERTYPE,
    status: ApprovalInternalStatusEnum,
    tenor_persetujuan?: number,
    nominal_persetujuan?: number,
    keterangan?: string,
    kesimpulan?: string,
    dokumen_pendukung?: string,
  ) {
    try {
      console.log(
        `CA_ApproveOrRejectUseCase.execute(loan_id: ${loan_id}, user_id: ${user_id}, role: ${role}, status: ${status}, keterangan: ${keterangan})`,
      );
      // Validasi loan
      const loan = await this.loanAppRepo.findById(loan_id);
      if (!loan) {
        throw new HttpException(
          {
            error: true,
            message: `Pengajuan dengan ID ${loan_id} tidak ditemukan`,
            reference: 'LOAN_NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Validasi user
      const user = await this.userRepo.findById(user_id);
      if (!user) {
        throw new HttpException(
          {
            error: true,
            message: `Pengguna dengan ID ${user_id} tidak ditemukan`,
            reference: 'USER_NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Validasi role
      if (role !== USERTYPE.CA) {
        throw new HttpException(
          {
            error: true,
            message:
              'Hanya pengguna dengan role CA yang dapat melakukan approval',
            reference: 'ROLE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Buat entitas approval
      const approval = new ApprovalInternal(
        loan_id,
        { id: user_id! },
        role,
        ApprovalInternalStatusEnum.PENDING,
        tenor_persetujuan,
        nominal_persetujuan,
        false,
        undefined,
        keterangan || '',
        kesimpulan || '',
        dokumen_pendukung || undefined,
      );

      // Terapkan status approval
      let newLoanStatus: StatusPengajuanEnum;

      if (status === ApprovalInternalStatusEnum.APPROVED) {
        approval.approve();
        newLoanStatus = StatusPengajuanEnum.APPROVED_CA;
      } else if (status === ApprovalInternalStatusEnum.REJECTED) {
        approval.reject();
        newLoanStatus = StatusPengajuanEnum.REJECTED_CA;
      } else {
        throw new HttpException(
          {
            error: true,
            message: `Status ${status} tidak valid untuk approval`,
            reference: 'STATUS_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Simpan approval
      const savedApproval = await this.approvalRepo.save(approval);

      // Update status pengajuan di loan app
      await this.loanAppRepo.updateLoanAppInternalStatus(
        loan_id,
        newLoanStatus,
      );

      return {
        error: false,
        message: `Approval berhasil disimpan dengan status ${savedApproval.status}`,
        reference: 'APPROVAL_SUCCESS',
        data: {
          id: savedApproval.id,
          status: savedApproval.status,
          keterangan: savedApproval.keterangan,
          kesimpulan: savedApproval.kesimpulan,
          created: savedApproval.createdAt,
          updated: savedApproval.updatedAt,
        },
      };
    } catch (err) {
      console.log(err);
      // Tangani error tak terduga
      throw new HttpException(
        {
          error: true,
          message: err.message || 'Unexpected error',
          reference: 'APPROVAL_UNKNOWN_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
