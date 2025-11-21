import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
import { StatusKaryawanEnum } from 'src/Shared/Enums/External/Job.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('job_external')
export class JobExternal_ORM_Entity {
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
    foreignKeyConstraintName: 'FK_ClientExternalID_at_JobExternal',
  })
  nasabah: ClientExternal_ORM_Entity;

  @Column({ type: 'varchar', length: 255 })
  perusahaan: string;

  @Column({ type: 'varchar', length: 255 })
  alamat_perusahaan: string;

  @Column({ type: 'varchar', length: 255 })
  kontak_perusahaan: string;

  @Column({ type: 'varchar', length: 255 })
  jabatan: string;

  @Column({ type: 'varchar', length: 255 })
  lama_kerja: string;

  @Column({ type: 'enum', enum: StatusKaryawanEnum })
  status_karyawan: StatusKaryawanEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  pendapatan_perbulan: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slip_gaji_peminjam?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slip_gaji_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  norek?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  id_card_peminjam?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  id_card_penjamin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lama_kontrak?: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_pekerjaan?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
