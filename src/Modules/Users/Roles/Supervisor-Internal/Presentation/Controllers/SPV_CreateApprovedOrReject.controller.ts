import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { SPV_ApproveOrRejectUseCase } from 'src/Modules/Users/Roles/Supervisor-Internal/Applications/Services/SPV_ApprovedOrReject.usecase';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { CurrentUser } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { JwtToken } from 'src/Shared/Modules/Authentication/Infrastructure/Decorators/jwt-extractor.decorator';

@Controller('spv/int/loan-app')
export class SPV_ApprovedOrRejectController {
  constructor(
    private readonly approveOrRejectUseCase: SPV_ApproveOrRejectUseCase,
  ) {}

  @Post('approve-or-reject/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'additional_files', maxCount: 1 }], {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async approveOrReject(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Req() req: Request,
    @Param('id') loan_id: number,
    @Body()
    body: {
      status: ApprovalInternalStatusEnum;
      tenor_persetujuan?: number;
      nominal_persetujuan?: number;
      keterangan?: string;
      marketingId?: number;
    },
    @CurrentUser('id') supervisorId: number,
    @JwtToken()
    token?: string,
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
      files,
      body.marketingId,
      token,
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
