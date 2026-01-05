import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { HM_ApproveOrRejectExternalUseCase } from '../../../Application/Services/External/HM_ApprovedOrReject.usecase';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';

@Controller('hm/ext/loan-apps')
export class HM_ApprovedOrRejectExternalController {
  constructor(
    private readonly approveOrRejectUseCase: HM_ApproveOrRejectExternalUseCase,
  ) {}

  @Post('approve-or-reject/:id')
  async approveOrReject(
    @Req() req: Request,
    @Param('id') loan_id: number,
    @Body('payload')
    payload: {
      isBanding: boolean;
      status: ApprovalExternalStatus;
      kesimpulan?: string;
      tenor_persetujuan?: number;
      nominal_persetujuan?: number;
    },
    @CurrentUser('id') headMarketingId: number,
  ) {
    console.log('--- HM_ApprovedOrRejectController ---');
    console.log('Request URL:', req.url);
    console.log('Loan ID param:', loan_id);
    console.log('Body:', payload);
    console.log('HeadMarketingId from cookie/decorator:', headMarketingId);

    // Validasi HM ID
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
      );

      console.log('Approval berhasil disimpan:', savedApproval);

      // Return response
      return {
        message: `Approval berhasil disimpan dengan status ${payload.status}`,
        data: {
          id: savedApproval.data.id,
          status: savedApproval.data.status,
          kesimpulan: savedApproval.data.kesimpulan,
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
