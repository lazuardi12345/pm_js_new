import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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

    const approval = new ApprovalExternal(
      { id: dto.pengajuan_id },
      dto.user_id,
      dto.role,
      dto.is_banding,
      undefined,
      dto.analisa,
      dto.nominal_persetujuan,
      dto.tenor_persetujuan,
      dto.status,
      dto.kesimpulan,
      now,
      now,
      null,
    );

    return this.repo.save(approval);
  }

  async update(
    id: number,
    dto: UpdateApprovalExternalDto,
  ): Promise<ApprovalExternal> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Approval dengan ID ${id} tidak ditemukan`);
    }
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<ApprovalExternal> {
    const result = await this.repo.findById(id);
    if (!result) {
      throw new NotFoundException(`Approval dengan ID ${id} tidak ditemukan`);
    }
    return result;
  }

  async findAll(): Promise<ApprovalExternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Approval dengan ID ${id} tidak ditemukan`);
    }
    await this.repo.delete(id);
  }
}
