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

  @OneToOne(() => LoanApplicationExternal_ORM_Entity, (pengajuan) => pengajuan.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pengajuan_id', foreignKeyConstraintName: 'FK_LoanApplicationExternalID_at_CollateralByBPJS' })
  pengajuan: LoanApplicationExternal_ORM_Entity;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  saldo_bpjs?: number;

  @Column({ type: 'date', nullable: true })
  tanggal_bayar_terakhir?: Date;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  foto_bpjs?: string;

  @Column({ nullable: true })
  foto_jaminan_tambahan?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
