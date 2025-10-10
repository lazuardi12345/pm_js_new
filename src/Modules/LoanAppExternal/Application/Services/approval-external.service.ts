import { Injectable, Inject } from '@nestjs/common';
import {
    IApprovalExternalRepository,
    APPROVAL_EXTERNAL_REPOSITORY,
  } from '../../Domain/Repositories/approval-external.repository';
import { ApprovalExternal } from '../../Domain/Entities/approval-external.entity';
import { CreateApprovalExternalDto } from '../DTOS/dto-Approval/create-approval.dto';
import { UpdateApprovalExternalDto } from '../DTOS/dto-Approval/update-approval.dto';

@Injectable()
export class ApprovalExternalService {
  constructor(
    @Inject(APPROVAL_EXTERNAL_REPOSITORY)
    private readonly repo: IApprovalExternalRepository,
  ) {}

  async create(dto: CreateApprovalExternalDto): Promise<ApprovalExternal> {
    const now = new Date();

    const address = new ApprovalExternal(
    dto.pengajuan_id,             // pengajuanId
    dto.user_id,                  // userId
    dto.role,                    // role
    dto.is_banding,               // isBanding (default false)
    undefined,                   // id (optional)
    dto.analisa,                 // analisa (optional)
    dto.nominal_pinjaman,         // nominalPinjaman (optional)
    dto.tenor,                   // tenor (optional)
    dto.status,                  // status (optional)
    dto.catatan,                 // catatan (optional)
    now,                         // createdAt
    now,                         // updatedAt
    null                         // deletedAt                           // deletedAt
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateApprovalExternalDto): Promise<ApprovalExternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<ApprovalExternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ApprovalExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
