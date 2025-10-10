import { ClientInternal_ORM_Entity } from './client-internal.orm-entity';
import { StatusRumahEnum, DomisiliEnum } from 'src/Shared/Enums/Internal/Address.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('address_internal')
export class AddressInternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientInternal_ORM_Entity, (clientInternal) => clientInternal.id, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'nasabah_id', foreignKeyConstraintName: 'FK_ClientInternalID_at_AddressInternal' })
  nasabah: ClientInternal_ORM_Entity;
  
  @Column({ type: 'varchar', length: 255 })
  alamat_ktp: string;

  @Column({ type: 'varchar', length: 255 })
  rt_rw: string;

  @Column({ type: 'varchar', length: 255 })
  kelurahan: string;

  @Column({ type: 'varchar', length: 255 })
  kecamatan: string;

  @Column({ type: 'varchar', length: 255 })
  kota: string;

  @Column({ type: 'varchar', length: 255 })
  provinsi: string;

  @Column({
    type: 'enum',
    enum: StatusRumahEnum,
    nullable: true, // default: NULL
  })
  status_rumah_ktp?: StatusRumahEnum;

  @Column({
    type: 'enum',
    enum: StatusRumahEnum,
  })
  status_rumah: StatusRumahEnum;

  @Column({
    type: 'enum',
    enum: DomisiliEnum,
  })
  domisili: DomisiliEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alamat_lengkap?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
