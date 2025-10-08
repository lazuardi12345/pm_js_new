import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ClientExternal_ORM_Entity } from './client-external.orm-entity';
import {
  HubunganPenjaminEnum,
  PersetujuanPenjaminEnum,
} from 'src/Shared/Enums/External/Loan-Guarantor.enum';
@Entity('loan_guarantor_external')
export class LoanGuarantorExternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientExternal_ORM_Entity, (clientExternal) => clientExternal.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientExternalID_at_LoanGuarantorExternal',
  })
  nasabah: ClientExternal_ORM_Entity;

  @Column({ type: 'enum', enum: HubunganPenjaminEnum })
  hubungan_penjamin: HubunganPenjaminEnum;

  @Column({ type: 'varchar', length: 255 })
  nama_penjamin: string;

  @Column({ type: 'varchar', length: 255 })
  pekerjaan_penjamin: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  penghasilan_penjamin: number;

  @Column({ type: 'varchar', length: 255 })
  no_hp_penjamin: string;

  @Column({ type: 'enum', enum: PersetujuanPenjaminEnum })
  persetujuan_penjamin: PersetujuanPenjaminEnum;

  @Column({ type: 'varchar', length: 255 })
  foto_ktp_penjamin: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_penjamin?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
