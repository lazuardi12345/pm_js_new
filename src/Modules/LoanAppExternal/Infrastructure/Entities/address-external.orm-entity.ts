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
  StatusRumahEnum,
  DomisiliEnum,
  RumahDomisiliEnum,
} from 'src/Shared/Enums/External/Address.enum';

@Entity('address_external')
export class AddressExternal_ORM_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  // Relasi ke nasabah
  @ManyToOne(() => ClientExternal_ORM_Entity)
  @JoinColumn({
    name: 'nasabah_id',
    foreignKeyConstraintName: 'FK_ClientExternal_at_AddressExtenal',
  })
  nasabah: ClientExternal_ORM_Entity;

  // Informasi alamat
  @Column()
  alamat_ktp: string;

  @Column()
  rt_rw: string;

  @Column()
  kelurahan: string;

  @Column()
  kecamatan: string;

  @Column()
  kota: string;

  @Column()
  provinsi: string;

  @Column({ type: 'enum', enum: StatusRumahEnum })
  status_rumah: StatusRumahEnum;

  @Column({ type: 'enum', enum: DomisiliEnum })
  domisili: DomisiliEnum;

  @Column({ type: 'enum', enum: RumahDomisiliEnum })
  rumah_domisili: RumahDomisiliEnum;

  @Column({ nullable: true })
  alamat_domisili?: string;

  @Column({ type: 'float', nullable: true })
  biaya_perbulan?: number;

  @Column({ type: 'float', nullable: true })
  biaya_pertahun?: number;

  @Column({ type: 'float', nullable: true })
  biaya_perbulan_domisili?: number;

  @Column({ type: 'float', nullable: true })
  biaya_pertahun_domisili?: number;

  @Column({ nullable: true })
  lama_tinggal?: string;

  @Column()
  atas_nama_listrik: string;

  @Column()
  hubungan: string;

  @Column({ nullable: true })
  foto_meteran_listrik?: string;

  @Column({ nullable: true })
  share_loc_domisili?: string;

  @Column({ nullable: true })
  share_loc_usaha?: string;

  @Column({ nullable: true })
  share_loc_tempat_kerja?: string;

  @Column({ nullable: true })
  validasi_alamat?: boolean;

  @Column({ nullable: true })
  catatan?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;
}
