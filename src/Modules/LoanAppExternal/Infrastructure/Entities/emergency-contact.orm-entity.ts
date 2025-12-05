import { ClientExternal_ORM_Entity } from 'src/Modules/LoanAppExternal/Infrastructure/Entities/client-external.orm-entity';
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

@Entity('emergency_contact_external')
export class EmergencyContactExternal_ORM_Entity {
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
    foreignKeyConstraintName: 'FK_ClientExternalID_at_EmergencyContactExternal',
  })
  nasabah: ClientExternal_ORM_Entity;

  @Column({ type: 'varchar', length: 255 })
  nama_kontak_darurat: string;

  @Column({ type: 'varchar', length: 255 })
  hubungan_kontak_darurat: string;

  @Column({ type: 'varchar', length: 255 })
  no_hp_kontak_darurat: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_kontak_darurat?: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
