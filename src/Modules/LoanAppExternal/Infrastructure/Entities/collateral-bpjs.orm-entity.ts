import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LoanApplicationExternal_ORM_Entity } from './loan-application-external.orm-entity';

@Entity('collateral_by_bpjs')
export class CollateralByBPJS_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(
    () => LoanApplicationExternal_ORM_Entity,
    (pengajuan) => pengajuan.bpjs,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'pengajuan_id',
    foreignKeyConstraintName:
      'FK_LoanApplicationExternalID_at_CollateralByBPJS',
  })
  pengajuanLuar: LoanApplicationExternal_ORM_Entity;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  saldo_bpjs: number;

  @Column({ type: 'date', nullable: false })
  tanggal_bayar_terakhir: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_bpjs?: string;

  // Sesuai entity: jaminan_tambahan (bukan foto_jaminan_tambahan)
  @Column({ type: 'varchar', length: 500, nullable: true })
  jaminan_tambahan?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
