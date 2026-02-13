import { Injectable, Inject } from '@nestjs/common';
import {
  IApprovalInternalRepository,
  APPROVAL_INTERNAL_REPOSITORY,
} from '../../Domain/Repositories/approval-internal.repository';
import { ApprovalInternal } from '../../Domain/Entities/approval-internal.entity';
import { CreateApprovalDto } from '../DTOS/dto-Approval/create-approval.dto';
import { UpdateApprovalDto } from '../DTOS/dto-Approval/update-approval.dto';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import { ApprovalInternalNotificationRaw } from '../DTOS/dto-Address/get-total-notification.dto';

@Injectable()
export class ApprovalInternalService {
  constructor(
    @Inject(APPROVAL_INTERNAL_REPOSITORY)
    private readonly repo: IApprovalInternalRepository,
  ) {}

  async create(dto: CreateApprovalDto): Promise<ApprovalInternal> {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', dto);
    const now = new Date();
    const address = new ApprovalInternal(
      dto.pengajuan_id,
      { id: dto.user_id },
      dto.role,
      dto.status ? dto.status : ApprovalInternalStatusEnum.PENDING,
      dto.tenor_persetujuan,
      dto.nominal_persetujuan,
      dto.is_banding ?? false,
      undefined,
      dto.keterangan,
      dto.kesimpulan,
      dto.dokumen_pendukung,
      now,
      now,
      null,
    );
    return this.repo.save(address);
  }

  async update(id: number, dto: UpdateApprovalDto): Promise<ApprovalInternal> {
    return this.repo.update(id, dto);
  }

  async findById(id: number): Promise<ApprovalInternal | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<ApprovalInternal[]> {
    return this.repo.findAll();
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async getApprovalRequestNotif(
    role: USERTYPE,
    userId: number,
  ): Promise<ApprovalInternalNotificationRaw> {
    // Validasi role yang diperbolehkan

    const normalizedRole = role.trim().toLowerCase();

    const allowedRoles: string[] = [
      USERTYPE.HM,
      USERTYPE.CA,
      USERTYPE.MARKETING,
    ];

    if (!Object.values(USERTYPE).includes(normalizedRole as USERTYPE)) {
      throw new Error(`Invalid user role: ${role}`);
    }

    if (!allowedRoles.includes(normalizedRole)) {
      return { total: 0 };
    }

    return this.repo.totalApprovalRequestInternal(
      normalizedRole as USERTYPE,
      userId,
    );
  }
}
