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
import { NotificationClientService } from 'src/Shared/Modules/Notifications/Infrastructure/Services/notification.service';
import {
  FILE_STORAGE_SERVICE,
  IFileStorageRepository,
} from 'src/Shared/Modules/Storage/Domain/Repositories/IFileStorage.repository';
import { REQUEST_TYPE } from 'src/Shared/Modules/Storage/Infrastructure/Service/Interface/RequestType.interface';

@Injectable()
export class SPV_ApproveOrRejectUseCase {
  constructor(
    @Inject(APPROVAL_INTERNAL_REPOSITORY)
    private readonly approvalRepo: IApprovalInternalRepository,
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(USERS_REPOSITORY)
    private readonly userRepo: IUsersRepository,
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageRepository,

    private readonly notificationClient: NotificationClientService,
  ) {}

  async execute(
    loan_id: number,
    user_id: number,
    role: USERTYPE,
    status: ApprovalInternalStatusEnum,
    tenor_persetujuan?: number,
    nominal_persetujuan?: number,
    keterangan?: string,
    files?: Record<string, Express.Multer.File[]>,
    marketingId?: number,
    token?: string,
  ) {
    try {
      console.log(
        `SPV_ApproveOrRejectUseCase.execute(loan_id: ${loan_id}, user_id: ${user_id}, role: ${role}, status: ${status}, keterangan: ${keterangan})`,
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
      if (role !== USERTYPE.SPV) {
        throw new HttpException(
          {
            error: true,
            message:
              'Hanya pengguna dengan role SPV yang dapat melakukan approval',
            reference: 'ROLE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let additionalFileUrl: string | undefined;

      if (files?.additional_files?.length) {
        const filePaths = await this.fileStorage.saveFiles(
          1,
          'supervisor',
          { additional_files: files.additional_files },
          REQUEST_TYPE.INTERNAL,
        );

        // Ambil file pertama aja
        additionalFileUrl = filePaths?.additional_files?.[0]?.url;
      }

      // Buat entitas approval
      const approval = new ApprovalInternal(
        loan_id,
        { id: user.id! },
        role,
        ApprovalInternalStatusEnum.PENDING,
        tenor_persetujuan,
        nominal_persetujuan,
        false,
        undefined,
        keterangan || '',
        undefined,
        additionalFileUrl,
      );

      // Terapkan status approval
      let newLoanStatus: StatusPengajuanEnum;
      if (status === ApprovalInternalStatusEnum.APPROVED) {
        approval.approve();
        newLoanStatus = StatusPengajuanEnum.APPROVED_SPV;
      } else if (status === ApprovalInternalStatusEnum.REJECTED) {
        approval.reject();
        newLoanStatus = StatusPengajuanEnum.REJECTED_SPV;
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

      if (!token) {
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }

      if (status === ApprovalInternalStatusEnum.APPROVED) {
        await this.notificationClient.sendSPVApprovalResponseNotification(
          loan_id,
          user_id,
          marketingId,
          token,
        );
      } else if (status === ApprovalInternalStatusEnum.REJECTED) {
        await this.notificationClient.sendSPVRejectionResponseNotification(
          loan_id,
          user_id,
          marketingId,
          token,
        );
      }
      return {
        error: false,
        message: `Approval berhasil disimpan dengan status ${savedApproval.status}`,
        reference: 'APPROVAL_SUCCESS',
        data: {
          id: savedApproval.id,
          status: savedApproval.status,
          loan_status: newLoanStatus,
          keterangan: savedApproval.keterangan,
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
