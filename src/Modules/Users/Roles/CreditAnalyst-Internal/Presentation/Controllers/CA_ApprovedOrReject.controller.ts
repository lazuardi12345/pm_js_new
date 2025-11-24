import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { CA_ApproveOrRejectUseCase } from '../../Applications/Services/CA_ApprovedOrReject.usecase';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { Roles } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/roles.decorator';

@Controller('ca/int/loan-app')
export class CA_ApprovedOrRejectController {
  constructor(
    private readonly approveOrRejectUseCase: CA_ApproveOrRejectUseCase,
  ) {}

  @Roles(USERTYPE.CA)
  @Post('approve-or-reject/:id')
  async approveOrReject(
    @Req() req: Request,
    @Param('id') loan_id: number,
    @Body()
    body: {
      payload: {
        status: ApprovalInternalStatusEnum;
        keterangan?: string;
        kesimpulan?: string;
        tenor_persetujuan?: number;
        nominal_persetujuan?: number;
      };
    },
    @CurrentUser('id') creditAnalystId: number,
  ) {
    // Ambil CA ID dari cookie
    if (!creditAnalystId) {
      throw new Error('CA ID tidak ditemukan di cookie');
    }

    console.log('dari controller', body);

    // Jalankan use case
    const savedApproval = await this.approveOrRejectUseCase.execute(
      loan_id,
      creditAnalystId,
      USERTYPE.CA,
      body.payload.status,
      body.payload.tenor_persetujuan,
      body.payload.nominal_persetujuan,
      body.payload.keterangan,
      body.payload.kesimpulan,
    );

    // Return response
    return {
      message: `Approval berhasil disimpan dengan status ${body.payload.status}`,
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
