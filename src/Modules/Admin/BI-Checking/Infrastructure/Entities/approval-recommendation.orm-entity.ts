// src/Modules/ApprovalRecommendation/Infrastructure/Entities/approval-recommendation.orm-entity.ts

import { LoanApplicationInternal_ORM_Entity } from 'src/Modules/LoanAppInternal/Infrastructure/Entities/loan-application-internal.orm-entity';
import { LoanApplicationExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/loan-application-external.orm-entity';
// ... import lainnya

export enum LoanTypeEnum {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('approval_recommendation')
export class ApprovalRecommendation_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: LoanTypeEnum })
  type: LoanTypeEnum;

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
