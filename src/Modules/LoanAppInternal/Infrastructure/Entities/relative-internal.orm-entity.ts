import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
import { KerabatKerjaEnum } from 'src/Shared/Enums/Internal/Relative.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('relative_internal')
export class RelativeInternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientInternal_ORM_Entity, (clientInternal) => clientInternal.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nasabah_id', foreignKeyConstraintName: 'FK_ClientInternalID_at_RelativesInternal' })
  nasabah: ClientInternal_ORM_Entity;

  @Column({ type: 'enum', enum: KerabatKerjaEnum })
  kerabat_kerja: KerabatKerjaEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alamat?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  no_hp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status_hubungan?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_perusahaan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
