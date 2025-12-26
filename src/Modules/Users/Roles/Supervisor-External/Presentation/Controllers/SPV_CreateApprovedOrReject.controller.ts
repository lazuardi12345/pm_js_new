import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SPV_ApproveOrRejectUseCase } from '../../Applications/Services/SPV_ApprovedOrReject.usecase';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('spv/ext/loan-apps')
export class SPV_ApprovedOrRejectController {
  constructor(
    private readonly approveOrRejectUseCase: SPV_ApproveOrRejectUseCase,
  ) {}

  @Post('approve-or-reject/:id')
  async approveOrReject(
    @Req() req: Request,
    @Param('id') loan_id: number,
    @Body()
    body: {
      status: ApprovalExternalStatus;
      approved_tenor?: number;
      approved_amount?: number;
      analisa?: string;
      kesimpulan?: string;
    },
    @CurrentUser('id') supervisorId: number,
  ) {
    // Ambil SPV ID dari cookie
    if (!supervisorId) {
      throw new Error('SPV ID tidak ditemukan di cookie');
    }

    // Jalankan use case
    const savedApproval = await this.approveOrRejectUseCase.execute(
      loan_id,
      supervisorId,
      USERTYPE.SPV,
      body.status,
      body.approved_tenor,
      body.approved_amount,
      body.kesimpulan,
    );

    // Return response
    return {
      message: `Approval berhasil disimpan dengan status ${body.status}`,
      data: {
        id: savedApproval.data.id,
        status: savedApproval.data.status,
        kesimpulan: savedApproval.data.kesimpulan,
        createdAt: savedApproval.data.created,
        updatedAt: savedApproval.data.updated,
      },
    };
  }
}
