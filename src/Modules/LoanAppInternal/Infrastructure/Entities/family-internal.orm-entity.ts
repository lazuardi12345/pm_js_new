import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
import { BekerjaEnum, HubunganEnum } from 'src/Shared/Enums/Internal/Family.enum';

@Entity('family_internal')
export class FamilyInternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientInternal_ORM_Entity, (clientInternal) => clientInternal.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nasabah_id', foreignKeyConstraintName: 'FK_ClientInternalID_at_FamilyInternal' })
  nasabah: ClientInternal_ORM_Entity;

  @Column({ type: 'enum', enum: HubunganEnum })
  hubungan: HubunganEnum;

  @Column({ type: 'varchar', length: 255 })
  nama: string;

  @Column({ type: 'enum', enum: BekerjaEnum })
  bekerja: BekerjaEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_perusahaan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jabatan?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  penghasilan?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alamat_kerja?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  no_hp?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
