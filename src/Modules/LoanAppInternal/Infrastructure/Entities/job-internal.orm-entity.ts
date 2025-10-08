import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
import { PerusahaanEnum, GolonganEnum } from 'src/Shared/Enums/Internal/Job.enum';
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

@Entity('job_internal')
export class JobInternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientInternal_ORM_Entity, (clientInternal) => clientInternal.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nasabah_id', foreignKeyConstraintName: 'FK_ClientInternalID_at_JobInternal' })
  nasabah: ClientInternal_ORM_Entity;

  @Column({ type: 'enum', enum: PerusahaanEnum })
  perusahaan: PerusahaanEnum;

  @Column({ type: 'varchar', length: 255 })
  divisi: string;

  @Column({ type: 'int', nullable: true })
  lama_kerja_bulan?: number;

  @Column({ type: 'int', nullable: true })
  lama_kerja_tahun?: number;

  @Column({ type: 'enum', enum: GolonganEnum })
  golongan: GolonganEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  yayasan?: string;

  @Column({ type: 'varchar', length: 255 })
  nama_atasan: string;

  @Column({ type: 'varchar', length: 255 })
  nama_hrd: string;

  @Column({ type: 'varchar', length: 255 })
  absensi: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bukti_absensi?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
