import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { LoanInternalDto } from '../DTOS/MKT_CreateLoanApplication.dto';
import { StatusPengajuanEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';

@Injectable()
export class MKT_TriggerFinalLoanStatusUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(loan_id: number, payload: any) {
    try {
      return await this.uow.start(async () => {
        const { status } = payload;

        // Loan application (khusus karena pakai findByNasabahId)
        let updatedLoanAppData: Partial<LoanInternalDto> = {};

        if (
          status === StatusPengajuanEnum.CLOSED ||
          status === StatusPengajuanEnum.DONE
        ) {
          const loanApps = await this.loanAppRepo.findById(loan_id);
          if (loanApps) {
            await this.loanAppRepo.triggerFinalLoanStatus(loan_id, status);
          }
        }

        const updatedFields = {
          ...updatedLoanAppData,
        };

        return {
          payload: {
            error: false,
            message: 'Status akhir pengajuan berhasil diajukan',
            reference: 'FINAL_LOAN_DECISION_TRIGGER_SUCCESS',
          },
        };
      });
    } catch (err: any) {
      console.log('errornya ayonima banget', err);
      console.error('Error in MKT_UpdateLoanApplicationUseCase:', err);
      throw new BadRequestException(err.message || 'Gagal update pengajuan');
    }
  }
}
