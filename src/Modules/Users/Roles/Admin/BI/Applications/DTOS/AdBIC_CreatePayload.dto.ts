import { RecommendationEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';

export class AdBIC_CreatePayloadDto {
  recommendation: RecommendationEnum;
  nominal_pinjaman: number;
  filePath?: string;
  nik: string;
  no_telp: string;
  email?: string;
  nama_nasabah: string;
  draft_id?: string;
  loan_application_internal_id?: number;
  loan_application_external_id?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
