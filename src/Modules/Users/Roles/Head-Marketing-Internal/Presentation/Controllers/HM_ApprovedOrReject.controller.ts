import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { HM_ApproveOrRejectUseCase } from '../../Application/Services/HM_ApprovedOrReject.usecase';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('hm/int/loan-apps')
export class HM_ApprovedOrRejectController {
  constructor(
    private readonly approveOrRejectUseCase: HM_ApproveOrRejectUseCase,
  ) {}

  @Post('approve-or-reject/:id')
  async approveOrReject(
    @Req() req: Request,
    @Param('id') loan_id: number,
    @Body('payload')
    payload: { status: ApprovalInternalStatusEnum; keterangan?: string },
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
        payload.keterangan,
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
