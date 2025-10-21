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

@Injectable()
export class MKT_TriggerAppealUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_INTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationInternalRepository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(loan_id: number, payload: any) {
    try {
      return await this.uow.start(async () => {
        const { alasan_banding } = payload;

        // Loan application (khusus karena pakai findByNasabahId)
        let updatedLoanAppData: Partial<LoanInternalDto> = {};

        if (alasan_banding) {
          const loanApps = await this.loanAppRepo.findById(loan_id);
          if (loanApps) {
            await this.loanAppRepo.triggerBanding(loan_id, alasan_banding);
          }
        }

        const updatedFields = {
          ...updatedLoanAppData,
        };

        return {
          payload: {
            error: false,
            message: 'Banding berhasil diajukan',
            reference: 'APPEAL_TRIGGER_SUCCESS',
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
