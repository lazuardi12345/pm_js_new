import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
import { PenjaminEnum, RiwayatPinjamPenjaminEnum } from 'src/Shared/Enums/Internal/Collateral.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('collateral_internal')
export class CollateralInternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientInternal_ORM_Entity, (clientInternal) => clientInternal.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'nasabah_id', foreignKeyConstraintName: 'FK_ClientInternalID_at_CollateralInternal' })
  nasabah_id: ClientInternal_ORM_Entity;

  @Column({ type: 'varchar', length: 255 })
  jaminan_hrd: string;

  @Column({ type: 'varchar', length: 255 })
  jaminan_cg: string;

  @Column({ type: 'enum', enum: PenjaminEnum })
  penjamin: PenjaminEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lama_kerja_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bagian?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  absensi?: string;

  @Column({
    type: 'enum',
    enum: RiwayatPinjamPenjaminEnum,
    nullable: true,
  })
  riwayat_pinjam_penjamin?: RiwayatPinjamPenjaminEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  riwayat_nominal_penjamin?: number;

  @Column({ type: 'int', nullable: true })
  riwayat_tenor_penjamin?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  sisa_pinjaman_penjamin?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jaminan_cg_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status_hubungan_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto_ktp_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto_id_card_penjamin?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
