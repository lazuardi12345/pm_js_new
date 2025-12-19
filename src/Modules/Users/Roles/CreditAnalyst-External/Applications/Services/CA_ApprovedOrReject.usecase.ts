import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ApprovalExternal } from 'src/Modules/LoanAppExternal/Domain/Entities/approval-external.entity';
import {
  IApprovalExternalRepository,
  APPROVAL_EXTERNAL_REPOSITORY,
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

@Injectable()
export class CA_ApproveOrRejectUseCase {
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
    status: ApprovalExternalStatus,
    tenor_persetujuan?: number,
    nominal_persetujuan?: number,
    analisa?: string,
    catatan?: string,
  ) {
    try {
      console.log(
        `CA_ApproveOrRejectUseCase.execute(loan_id: ${loan_id}, user_id: ${user_id}, role: ${role}, status: ${status}, analisa: ${analisa}, catatan: ${catatan})`,
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
      if (user.usertype !== USERTYPE.CA) {
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
      const approval = new ApprovalExternal(
        { id: loan_id },
        user_id,
        role,
        false,
        undefined,
        analisa,
        nominal_persetujuan,
        tenor_persetujuan,
        status,
        catatan,
      );

      // Terapkan status approval
      let newLoanStatus: StatusPengajuanEnum;
      if (status === ApprovalExternalStatus.APPROVED) {
        approval.isApproved();
        newLoanStatus = StatusPengajuanEnum.APPROVED_CA;
      } else if (status === ApprovalExternalStatus.REJECTED) {
        approval.isRejected();
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
          analisa: savedApproval.analisa,
          kesimpulan: savedApproval.kesimpulan,
          created: savedApproval.created_at,
          updated: savedApproval.updated_at,
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
