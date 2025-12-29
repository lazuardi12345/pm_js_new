import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  APPROVAL_EXTERNAL_REPOSITORY,
  IApprovalExternalRepository,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/approval-external.repository';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from 'src/Modules/Users/Domain/Repositories/users.repository';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
import { StatusPengajuanEnum } from 'src/Shared/Enums/External/Loan-Application.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { ApprovalExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/approval-external.entity';

@Injectable()
export class HM_ApproveOrRejectExternalUseCase {
  constructor(
    @Inject(APPROVAL_EXTERNAL_REPOSITORY)
    private readonly approvalRepo: IApprovalExternalRepository,
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,
    @Inject(USERS_REPOSITORY)
    private readonly userRepo: IUsersRepository,
  ) {}

  async execute(
    loan_id: number,
    user_id: number,
    role: USERTYPE,
    isBanding: boolean,
    status: ApprovalExternalStatus,
    tenor_persetujuan?: number,
    nominal_persetujuan?: number,
    keterangan?: string,
  ) {
    try {
      console.log(
        `HM_ApproveOrRejectUseCase.execute(loan_id: ${loan_id}, user_id: ${user_id}, role: ${role}, status: ${status}, keterangan: ${keterangan})`,
      );

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

      if (role !== USERTYPE.HM) {
        throw new HttpException(
          {
            error: true,
            message:
              'Hanya pengguna dengan role Head Marketing yang dapat melakukan approval',
            reference: 'ROLE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const approval = new ApprovalExternal(
        { id: loan.id! },
        user.id!,
        role,
        isBanding,
        undefined,
        null,
        nominal_persetujuan,
        tenor_persetujuan,
        ApprovalExternalStatus.PENDING,
        keterangan || '',
        undefined,
      );

      // Terapkan status approval
      let newLoanStatus: StatusPengajuanEnum;
      if (status === ApprovalExternalStatus.APPROVED) {
        approval.isApproved();
        newLoanStatus = StatusPengajuanEnum.APPROVED_HM;
      } else if (status === ApprovalExternalStatus.REJECTED) {
        approval.isRejected();
        newLoanStatus = StatusPengajuanEnum.REJECTED_HM;
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
      await this.loanAppRepo.updateLoanAppExternalStatus(
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
          keterangan: savedApproval.kesimpulan,
          created: savedApproval.created_at,
          updated: savedApproval.updated_at,
        },
      };
    } catch (err) {
      console.error(err);
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
