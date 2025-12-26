import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
// import { Notification } from 'src/Shared/Modules/Notifications/entities/notification.entity';
import { ApprovalInternal_ORM_Entity } from './approval-internal.orm-entity';
import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';
import { ApprovalRecommendation_ORM_Entity } from 'src/Modules/Admin/BI-Checking/Infrastructure/Entities/approval-recommendation.orm-entity';

@Entity('loan_application_internal')
export class LoanApplicationInternal_ORM_Entity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @ManyToOne(
    () => ClientInternal_ORM_Entity,
    (clientInternal) => clientInternal.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientInternalID_at_LoanApplicationInternal',
  })
  nasabah: ClientInternal_ORM_Entity;

  @Column({
    type: 'enum',
    enum: StatusPinjamanEnum,
    default: StatusPinjamanEnum.BARU,
  })
  status_pinjaman: StatusPinjamanEnum;

  @Column({ type: 'int', default: 1 })
  pinjaman_ke?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  nominal_pinjaman: number;

  @Column({ type: 'int' })
  tenor: number;

  @Column({ type: 'varchar', length: 255 })
  keperluan: string;

  @Column({
    type: 'enum',
    enum: StatusPengajuanEnum,
    default: StatusPengajuanEnum.PENDING,
  })
  status: StatusPengajuanEnum;

  @Column({
    type: 'enum',
    enum: StatusPengajuanAkhirEnum,
    nullable: true,
  })
  status_akhir_pengajuan: StatusPengajuanAkhirEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  riwayat_nominal?: number;

  @Column({ type: 'int', nullable: true })
  riwayat_tenor?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  sisa_pinjaman?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_banding: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alasan_banding?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  @Column({ type: 'char', length: 24, nullable: true })
  @Index('IDX_DraftID_at_LoanApplicationInternal', ['draft_id']) // <- index explicit name
  draft_id?: string;

  // // * Internal Loan Application (Pengajuans) RELATIONSHIPS TO ANOTHER ENTITIES
  // @OneToMany(() => Notification, (notif) => notif.pengajuan_dalam)
  // notifications: Notification[];
  @OneToMany(
    () => ApprovalInternal_ORM_Entity,
    (approvalInternal) => approvalInternal.pengajuan,
  )
  approvalsInternal: ApprovalInternal_ORM_Entity[];
}
