// Domain/Entities/approval-recommendation.entity.ts

import {
  LoanTypeEnum,
  RecommendationEnum,
} from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';

export class ApprovalRecommendation {
  constructor(
    public recommendation: RecommendationEnum,
    public filePath: string | undefined,
    public nominal_pinjaman: number,

    public readonly id?: number,
    public readonly draft_id?: string, // char(24) from Mongo
    public readonly nik?: string, // char(16) for NIK
    public readonly no_telp?: string, // char(14) for TELP
    public readonly email?: string,
    public readonly nama_nasabah?: string,
    public readonly catatan?: string,
    public readonly type?: LoanTypeEnum,
    public readonly created_at?: Date,
    public readonly deleted_at?: Date | null,

    public updated_at?: Date,
  ) {}
}
