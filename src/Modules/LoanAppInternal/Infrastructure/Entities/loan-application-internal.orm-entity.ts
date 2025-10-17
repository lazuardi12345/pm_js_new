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
} from 'typeorm';
import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
// import { Notification } from 'src/Shared/Modules/Notifications/entities/notification.entity';
import { ApprovalInternal_ORM_Entity } from './approval-internal.orm-entity';
import {
  StatusPinjamanEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/Internal/LoanApp.enum';

@Entity('loan_application_internal')
export class LoanApplicationInternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
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
  pinjaman_ke: number;

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

  // // * Internal Loan Application (Pengajuans) RELATIONSHIPS TO ANOTHER ENTITIES
  // @OneToMany(() => Notification, (notif) => notif.pengajuan_dalam)
  // notifications: Notification[];
  @OneToMany(
    () => ApprovalInternal_ORM_Entity,
    (approvalInternal) => approvalInternal.pengajuan,
  )
  approvalsInternal: ApprovalInternal_ORM_Entity[];
}
