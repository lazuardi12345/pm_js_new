import { LoanApplicationInternal_ORM_Entity } from './loan-application-internal.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { ApprovalInternalStatusEnum } from 'src/Shared/Enums/Internal/Approval.enum';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Index('IDX_LOAN_APPLICATION_ROLE', ['pengajuan', 'role'])
@Entity('approval_internal')
export class ApprovalInternal_ORM_Entity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(
    () => LoanApplicationInternal_ORM_Entity,
    (loanApplicationInternal) => loanApplicationInternal.approvalsInternal,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationInternalID_at_ApprovalInternal',
  })
  pengajuan: LoanApplicationInternal_ORM_Entity;

  @ManyToOne(() => Users_ORM_Entity, (user) => user.approvalInternals, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_UserID_at_ApprovalInternal',
  })
  user: Users_ORM_Entity;

  @Column({
    type: 'enum',
    enum: ['credit_analyst', 'supervisor', 'head_marketing'],
  })
  role: USERTYPE;

  @Column({
    type: 'enum',
    enum: ApprovalInternalStatusEnum,
    default: ApprovalInternalStatusEnum.PENDING,
  })
  status: ApprovalInternalStatusEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  nominal_persetujuan?: number;

  @Column({ type: 'int', nullable: true })
  tenor_persetujuan?: number;

  @Column({ type: 'tinyint', default: 0 })
  is_banding: boolean;

  @Column({ type: 'text', nullable: true })
  keterangan?: string;

  @Column({ type: 'text', nullable: true })
  kesimpulan?: string;

  @Column({ type: 'text', nullable: true })
  dokumen_pendukung?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
