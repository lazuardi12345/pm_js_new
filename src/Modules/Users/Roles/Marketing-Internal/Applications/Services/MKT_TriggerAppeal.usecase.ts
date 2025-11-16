import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  ILoanApplicationInternalRepository,
  LOAN_APPLICATION_INTERNAL_REPOSITORY,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/loanApp-internal.repository';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from 'src/Modules/LoanAppInternal/Domain/Repositories/IUnitOfWork.repository';

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
      // Validasi parameter dasar
      if (!loan_id || typeof loan_id !== 'number') {
        throw new BadRequestException('Loan ID tidak valid');
      }

      if (!payload || typeof payload !== 'object') {
        throw new BadRequestException('Payload tidak valid');
      }

      const { alasan_banding } = payload;

      // Cek alasan banding ada
      if (!alasan_banding || typeof alasan_banding !== 'string') {
        throw new BadRequestException('Alasan banding wajib diisi');
      }

      return await this.uow.start(async () => {
        // Cek pengajuan ada
        const loanAppExists = await this.loanAppRepo.findById(loan_id);
        if (!loanAppExists) {
          throw new NotFoundException(
            `Loan Application dengan id ${loan_id} tidak ditemukan`,
          );
        }

        // Trigger banding — execute SP atau update DB
        await this.loanAppRepo.triggerBanding(loan_id, alasan_banding);

        // Return response sesuai format lu
        return {
          payload: {
            error: false,
            message: 'Banding berhasil diajukan',
            reference: 'APPEAL_TRIGGER_SUCCESS',
          },
        };
      });
    } catch (err: any) {
      console.error('Error in MKT_TriggerAppealUseCase:', err);

      // Pastikan pesan error bersih & aman
      const message = err?.message || 'Gagal mengajukan banding';

      throw new BadRequestException(message);
    }
  }
}
