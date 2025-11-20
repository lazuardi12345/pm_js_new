import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  ILoanApplicationExternalRepository,
  LOAN_APPLICATION_EXTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppExternal/Domain/Repositories/loanApp-external.repository';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';
import { LoanApplicationExternalDto } from '../DTOS/MKT_CreateLoanApplicationExternal.dto';
import { StatusPengajuanAkhirEnum } from 'src/Shared/Enums/Internal/LoanApp.enum';

@Injectable()
export class MKT_TriggerFinalLoanStatusUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_EXTERNAL_REPOSITORY)
    private readonly loanAppRepo: ILoanApplicationExternalRepository,

    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(loan_id: number, payload: any) {
    try {
      return await this.uow.start(async () => {
        // Basic guard (tanpa ubah flow)
        if (!loan_id || typeof loan_id !== 'number') {
          throw new BadRequestException('loan_id tidak valid');
        }

        if (!payload || typeof payload !== 'object') {
          throw new BadRequestException('Payload tidak valid');
        }

        const { status_akhir_pengajuan } = payload;

        if (!status_akhir_pengajuan) {
          throw new BadRequestException('status_akhir_pengajuan wajib diisi');
        }

        // Loan application (khusus karena pakai findByNasabahId)
        let updatedLoanAppData: Partial<LoanApplicationExternalDto> = {};

        // Validasi enum tetap sama
        if (
          status_akhir_pengajuan === StatusPengajuanAkhirEnum.CLOSED ||
          status_akhir_pengajuan === StatusPengajuanAkhirEnum.DONE
        ) {
          const loanApps = await this.loanAppRepo.findById(loan_id);

          if (!loanApps) {
            throw new NotFoundException(
              `Loan Application id ${loan_id} tidak ditemukan`,
            );
          }

          await this.loanAppRepo.triggerFinalLoanStatus(
            loan_id,
            status_akhir_pengajuan,
          );
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
