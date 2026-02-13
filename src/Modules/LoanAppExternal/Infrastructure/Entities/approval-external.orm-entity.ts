import { LoanApplicationExternal_ORM_Entity } from './loan-application-external.orm-entity';
import { Users_ORM_Entity } from 'src/Modules/Users/Infrastructure/Entities/users.orm-entity';
import { ApprovalExternalStatus } from 'src/Shared/Enums/External/Approval.enum';
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

@Index('IDX_APPROVAL_EXTERNAL_ROLE_STATUS_CREATED_AT', [
  'role',
  'status',
  'created_at',
])
@Entity('approval_external')
export class ApprovalExternal_ORM_Entity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (loanApplicationExternal) => loanApplicationExternal.approvalExternals,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationExternalID_at_ApprovalExternal',
  })
  pengajuan_luar: LoanApplicationExternal_ORM_Entity;

  @ManyToOne(() => Users_ORM_Entity, (user) => user.approvalExternals, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_UserID_at_ApprovalExternal',
  })
  user: Users_ORM_Entity;

  @Column({
    type: 'enum',
    enum: ['credit_analyst', 'supervisor', 'head_marketing'],
  })
  role: USERTYPE;

  @Column({ type: 'text', nullable: true })
  analisa?: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  nominal_persetujuan?: number;

  @Column({ type: 'int', nullable: true })
  tenor_persetujuan?: number;

  @Column({ type: 'enum', enum: ApprovalExternalStatus, nullable: true })
  status?: ApprovalExternalStatus;

  @Column({ type: 'text', nullable: true })
  kesimpulan?: string;

  @Column({ type: 'text', nullable: true })
  dokumen_pendukung?: string;

  @Column({ type: 'tinyint', default: 0 })
  is_banding: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
