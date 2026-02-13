import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { HM_ApproveOrRejectInternalUseCase } from '../../../Application/Services/Internal/HM_ApprovedOrReject.usecase';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('hm/int/loan-apps')
export class HM_ApprovedOrRejectInternalController {
  constructor(
    private readonly approveOrRejectUseCase: HM_ApproveOrRejectInternalUseCase,
  ) {}

  @Post('approve-or-reject/:id')
  async approveOrReject(
    @Req() req: Request,
    @Param('id') loan_id: number,
    @Body('payload')
    payload: {
      status: ApprovalInternalStatusEnum;
      kesimpulan?: string;
      tenor_persetujuan?: number;
      nominal_persetujuan?: number;
      dokumen_pendukung?: string;
    },
    @CurrentUser('id') headMarketingId: number,
  ) {
    if (!headMarketingId) {
      console.error('HM ID tidak ditemukan di cookie/decorator!');
      throw new Error('HM ID tidak ditemukan di cookie/decorator');
    }

    try {
      // Jalankan use case
      const savedApproval = await this.approveOrRejectUseCase.execute(
        loan_id,
        headMarketingId,
        USERTYPE.HM,
        payload.status,
        payload.tenor_persetujuan,
        payload.nominal_persetujuan,
        payload.kesimpulan,
        payload.dokumen_pendukung,
      );

      console.log('Approval berhasil disimpan:', savedApproval);

      // Return response
      return {
        message: `Approval berhasil disimpan dengan status ${payload.status}`,
        data: {
          id: savedApproval.data.id,
          status: savedApproval.data.status,
          keterangan: savedApproval.data.keterangan,
          createdAt: savedApproval.data.created,
          updatedAt: savedApproval.data.updated,
        },
      };
    } catch (err) {
      console.error('Error saat execute usecase:', err);
      throw err;
    }
  }
}
