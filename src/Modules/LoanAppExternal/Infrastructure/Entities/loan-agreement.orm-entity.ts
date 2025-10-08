import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('loan_agreement')
export class LoanAggrement_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nomor_kontrak: string;

  @Column({ type: 'int', nullable: true })
  nomor_urut?: number;

  @Column({ type: 'varchar', length: 255 })
  nama: string;

  @Column({ type: 'text' })
  alamat: string;

  @Column({ type: 'varchar', length: 255 })
  no_ktp: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  kelompok?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  perusahaan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  inisial_marketing?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  golongan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  inisial_ca?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  id_card?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  kedinasan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pinjaman_ke?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pokok_pinjaman: number;

  @Column({ type: 'int' })
  tenor: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  biaya_admin: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  cicilan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  biaya_layanan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  bunga: number;

  @Column({ type: 'date' })
  tanggal_jatuh_tempo: Date;

  @Column({ type: 'text', nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
