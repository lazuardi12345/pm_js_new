import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SPV_ApproveOrRejectUseCase } from 'src/Modules/Users/Roles/Supervisor-Internal/Applications/Services/SPV_ApprovedOrReject.usecase';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';

@Controller('spv/int/loan-app')
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
      status: ApprovalInternalStatusEnum;
      tenor_persetujuan?: number;
      nominal_persetujuan?: number;
      keterangan?: string;
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
      body.tenor_persetujuan,
      body.nominal_persetujuan,
      body.keterangan,
    );

    // Return response
    return {
      message: `Approval berhasil disimpan dengan status ${body.status}`,
      data: {
        id: savedApproval.data.id,
        status: savedApproval.data.status,
        keterangan: savedApproval.data.keterangan,
        createdAt: savedApproval.data.created,
        updatedAt: savedApproval.data.updated,
      },
    };
  }
}
