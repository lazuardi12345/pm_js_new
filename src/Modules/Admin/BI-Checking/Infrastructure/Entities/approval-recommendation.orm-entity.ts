// src/Modules/ApprovalRecommendation/Infrastructure/Entities/approval-recommendation.orm-entity.ts

import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';
// ... import lainnya
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RecommendationEnum } from 'src/Shared/Enums/Admins/BI/approval-recommendation.enum';

@Entity('approval_recommendation')
export class ApprovalRecommendation_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  // @Column({ type: 'enum', enum: LoanTypeEnum })
  // type: LoanTypeEnum;

  @Column({ type: 'enum', enum: RecommendationEnum })
  recommendation: RecommendationEnum;

  @Column({ type: 'varchar' })
  filePath: string;

  @Column({ type: 'char', length: 16 })
  @Index('IDX_NIK_at_ApprovalRecommendation', ['nik']) // <- index explicit name
  nik: string;

  @Column({ type: 'char', length: 14 })
  no_telp: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  nama_nasabah: string;

  @Column({ type: 'char', length: 24, nullable: true })
  @Index('IDX_DraftID_at_ApprovalRecommendation', ['draft_id']) // <- index explicit name
  draft_id?: string;

  @ManyToOne(
    () => LoanApplicationInternal_ORM_Entity,
    (loanApplicationInternal) =>
      loanApplicationInternal.approvalRecommendations,
    {
      eager: false,
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'loan_application_internal_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationInternal_at_ApprovalRecommendation',
  })
  loanApplicationInternal: LoanApplicationInternal_ORM_Entity;
  @ManyToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (loanApplicationExternal) =>
      loanApplicationExternal.approvalRecommendations,
    {
      eager: false,
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'loan_application_external_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationExternal_at_ApprovalRecommendation',
  })
  loanApplicationExternal: LoanApplicationExternal_ORM_Entity;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
