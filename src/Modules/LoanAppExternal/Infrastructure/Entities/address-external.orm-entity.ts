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
import { ClientExternal_ORM_Entity } from './client-external.orm-entity';
import { StatusRumahEnum, DomisiliEnum, RumahDomisiliEnum } from 'src/Shared/Enums/External/Address.enum';

@Entity('address_external')
export class AddressExternal_ORM_Entity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => ClientExternal_ORM_Entity, (ClientExternal) => ClientExternal.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nasabah_id', foreignKeyConstraintName: 'FK_ClientExternalID_at_AddressExternal' })
  nasabah: ClientExternal_ORM_Entity;

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

  @Column({ type: 'enum', enum: StatusRumahEnum })
  status_rumah: StatusRumahEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  biaya_perbulan?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  biaya_pertahun?: number;

  @Column({ type: 'enum', enum: DomisiliEnum })
  domisili: DomisiliEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alamat_domisili?: string;

  @Column({ type: 'enum', enum: RumahDomisiliEnum })
  rumah_domisili: RumahDomisiliEnum;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  biaya_perbulan_domisili?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  biaya_pertahun_domisili?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lama_tinggal?: string;

  @Column({ type: 'varchar', length: 255 })
  atas_nama_listrik: string;

  @Column({ type: 'varchar', length: 255 })
  hubungan: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto_meteran_listrik?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  share_loc_link?: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  validasi_alamat?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
