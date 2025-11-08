import { ApprovalExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/approval-external.orm-entity';
import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
import { CollateralByBPJS_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-bpjs.orm-entity';
import { CollateralByBPKB_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-bpkb.orm-entity';
import { CollateralByKedinasan_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-kedinasan-mou.orm-entity';
import { CollateralBySHM_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/collateral-shm.orm-entity';
import { SurveyReports_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/survey-reports.orm-entity';
// import { Notification } from 'src/Shared/Modules/Notifications/entities/notification.entity';
import { ApprovalRecommendation_ORM_Entity } from 'src/Modules/Admin/BI-Checking/Infrastructure/Entities/approval-recommendation.orm-entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import {
  JenisPembiayaanEnum,
  StatusPinjamanEnum,
  StatusPengajuanEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';

@Entity('loan_application_external')
export class LoanApplicationExternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(
    () => ClientExternal_ORM_Entity,
    (clientExternal) => clientExternal.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientExternalID_at_LoanApplicationExternal',
  })
  nasabah: ClientExternal_ORM_Entity;

  @Column({ type: 'enum', enum: JenisPembiayaanEnum })
  jenis_pembiayaan: JenisPembiayaanEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  nominal_pinjaman: number;

  @Column({ type: 'int' })
  tenor: number;

  @Column({ type: 'varchar', length: 255 })
  berkas_jaminan: string;

  @Column({
    type: 'enum',
    enum: StatusPinjamanEnum,
    default: StatusPinjamanEnum.BARU,
  })
  status_pinjaman: StatusPinjamanEnum;

  @Column({ type: 'int', nullable: true })
  pinjaman_ke?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  pinjaman_terakhir?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  sisa_pinjaman?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  realisasi_pinjaman?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  cicilan_perbulan?: number;

  @Column({
    type: 'enum',
    enum: StatusPengajuanEnum,
    default: StatusPengajuanEnum.PENDING,
  })
  status_pengajuan: StatusPengajuanEnum;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_pengajuan?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catatan?: string;

  @Column({ type: 'text', nullable: true })
  catatan_spv?: string;

  @Column({ type: 'text', nullable: true })
  catatan_marketing?: string;

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

  // * External Loan Application (Pengajuan_nasabah_luars) RELATIONSHIPS TO ANOTHER ENTITIES

  // @OneToMany(() => Notification, (notif) => notif.pengajuan_luar)
  // notifications: Notification[];
  @OneToMany(
    () => ApprovalRecommendation_ORM_Entity,
    (approvalRecommendation) => approvalRecommendation.loanApplicationExternal,
  )
  approvalRecommendations: ApprovalRecommendation_ORM_Entity[];
  @OneToMany(
    () => ApprovalExternal_ORM_Entity,
    (approvalExternal) => approvalExternal.pengajuan_luar,
  )
  approvalExternals: ApprovalExternal_ORM_Entity[];
  @OneToOne(() => CollateralByBPKB_ORM_Entity, (bpkb) => bpkb.pengajuan)
  bpkb: CollateralByBPKB_ORM_Entity;
  @OneToOne(() => CollateralByBPJS_ORM_Entity, (bpjs) => bpjs.pengajuan)
  bpjs: CollateralByBPJS_ORM_Entity;
  @OneToOne(
    () => CollateralByKedinasan_ORM_Entity,
    (kedinasan) => kedinasan.pengajuan,
  )
  kedinasan: CollateralByKedinasan_ORM_Entity;
  @OneToOne(() => CollateralBySHM_ORM_Entity, (shm) => shm.pengajuan)
  shm: CollateralBySHM_ORM_Entity;
  @OneToOne(() => SurveyReports_ORM_Entity, (hasil) => hasil.pengajuan_luar)
  hasil_survey: SurveyReports_ORM_Entity;
}
