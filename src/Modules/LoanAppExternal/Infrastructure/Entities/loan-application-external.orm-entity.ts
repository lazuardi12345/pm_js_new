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
  Index,
} from 'typeorm';

import {
  JenisPembiayaanEnum,
  StatusPinjamanEnum,
  StatusPengajuanEnum,
  StatusPengajuanAkhirEnum,
} from 'src/Shared/Enums/External/Loan-Application.enum';
import { CollateralByKedinasan_Non_MOU_ORM_Entity } from './collateral-kedinasan-non-mou.orm-entity';
import { CollateralByUMKM_ORM_Entity } from './collateral-umkm.orm.entity';
import { OtherExistLoansExternal_ORM_Entity } from './other-exist-loans.orm-entity';

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
  @Index('IDX_JENIS_PEMBIAYAAN') // ← TAMBAHIN INI
  jenis_pembiayaan: JenisPembiayaanEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  nominal_pinjaman: number;

  @Column({ type: 'int' })
  tenor: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  berkas_jaminan?: string | null;

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

  @Column({
    type: 'enum',
    enum: StatusPengajuanAkhirEnum,
    nullable: true,
  })
  status_pengajuan_akhir: StatusPengajuanAkhirEnum;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_pengajuan?: boolean;

  @Column({ type: 'text', nullable: true })
  catatan_spv?: string;

  @Column({ type: 'text', nullable: true })
  catatan_marketing?: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_banding: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alasan_banding?: string;

  @Column({ type: 'date', nullable: true })
  survey_schedule?: Date;

  @Column({ type: 'char', length: 24, nullable: true })
  @Index('IDX_DraftID_at_LoanApplicationExternal', ['draft_id']) // <- index explicit name
  draft_id?: string;

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
    () => ApprovalExternal_ORM_Entity,
    (approvalExternal) => approvalExternal.pengajuan_luar,
  )
  approvalExternals: ApprovalExternal_ORM_Entity[];
  @OneToOne(
    () => OtherExistLoansExternal_ORM_Entity,
    (otherExistLoan) => otherExistLoan.loanAppExternal,
    { cascade: true },
  )
  otherExistLoans: OtherExistLoansExternal_ORM_Entity;
  @OneToOne(() => CollateralByBPKB_ORM_Entity, (bpkb) => bpkb.pengajuanLuar)
  bpkb: CollateralByBPKB_ORM_Entity;
  @OneToOne(() => CollateralByBPJS_ORM_Entity, (bpjs) => bpjs.pengajuanLuar)
  bpjs: CollateralByBPJS_ORM_Entity;
  @OneToOne(
    () => CollateralByKedinasan_ORM_Entity,
    (kedinasan) => kedinasan.pengajuanLuar,
  )
  kedinasan_MOU: CollateralByKedinasan_Non_MOU_ORM_Entity;
  @OneToOne(
    () => CollateralByKedinasan_Non_MOU_ORM_Entity,
    (Kedinasan_NON_MOU) => Kedinasan_NON_MOU.pengajuanLuar,
  )
  Kedinasan_NON_MOU: CollateralByKedinasan_Non_MOU_ORM_Entity;
  @OneToOne(() => CollateralBySHM_ORM_Entity, (shm) => shm.pengajuanLuar)
  shm: CollateralBySHM_ORM_Entity;
  @OneToOne(() => CollateralByUMKM_ORM_Entity, (umkm) => umkm.pengajuanLuar)
  umkm: CollateralByUMKM_ORM_Entity;
  @OneToOne(() => SurveyReports_ORM_Entity, (hasil) => hasil.pengajuan_luar)
  hasil_survey: SurveyReports_ORM_Entity;
}
